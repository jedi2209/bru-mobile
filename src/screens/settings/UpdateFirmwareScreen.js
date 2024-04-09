import React, {useEffect, useState} from 'react';
import Wrapper from '../../core/components/Wrapper';
import {
  Progress,
  ProgressFilledTrack,
  Toast,
  ToastDescription,
  ToastTitle,
  useToast,
  VStack,
} from '@gluestack-ui/themed';
import useBle from '../../hooks/useBlePlx';
import {Alert, StyleSheet, Text, View} from 'react-native';
import {downloadFile, getFileURL, getFirmwareData} from '../../utils/firmware';
import {DFUEmitter} from 'react-native-nordic-dfu';
import {getCommand, sleep} from '../../utils/commands';

const _renderProgressBar = value => {
  return (
    <Progress value={value} size="md">
      <ProgressFilledTrack bg="$primary500" />
    </Progress>
  );
};

const getStatus = status => {
  switch (status) {
    case 'start':
      return 'Downloading BRU firmware';
    case 'connecting':
      return 'Connecting to the device';
    case 'final':
      return 'We succesfully update your firmware';
    case 'error':
      return 'Some error occured during firmware instalation please try again later';
    case 'updating':
      return 'Updating firmware...';
    default:
      break;
  }
};

export const UpdateFirmwareScreen = props => {
  const {fileName, filePath} = props.route.params;
  const [progress, setProgress] = useState(0);
  const [updateStatus, setUpdateStatus] = useState('start');
  const [downloadedFile, setDownloadedFile] = useState(null);

  const toast = useToast();
  const {
    scanDFU,
    startDFU,
    connectToDFU,
    setDeviceDFU,
    writeValueWithResponse,
    deviceDFU,
  } = useBle();

  useEffect(() => {
    async function start() {
      let file;
      let nameOfFile;
      if (!filePath || !fileName) {
        const data = await getFirmwareData();
        const availableFirmware = data.find(
          firmwareData => firmwareData.testAvailable,
        );
        file = await getFileURL('firmware/' + availableFirmware.file);
        nameOfFile = availableFirmware.file;
      }

      const fileDownloaded = await downloadFile(
        filePath || file,
        fileName || nameOfFile,
      );

      setDownloadedFile(fileDownloaded);
      const command = getCommand(0x27, [], 4);
      await writeValueWithResponse(command);
      setUpdateStatus('connecting');
      scanDFU();
    }
    start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    async function update() {
      await updateFirmware();
    }

    if (deviceDFU) {
      update();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deviceDFU]);

  const updateFirmware = async () => {
    try {
      await connectToDFU(deviceDFU);

      if (!downloadedFile) {
        Alert.alert("Can't download file");
        return;
      }
      DFUEmitter.addListener(
        'DFUProgress',
        ({percent, currentPart, partsTotal, avgSpeed, speed}) => {
          setProgress(percent);
        },
      );
      DFUEmitter.addListener('DFUStateChanged', ({state}) => {
        console.info('DFU State inside:', state);
        switch (state) {
          case 'DFU_PROCESS_STARTING':
            console.info('DFUEmitter listener => DFU_PROCESS_STARTING');
            setUpdateStatus('updating');
            break;
          case 'DEVICE_DISCONNECTING':
            setUpdateStatus('finish');
            setProgress(0);
            break;
        }
      });
      const statusDFU = await startDFU(downloadedFile);
      if (statusDFU) {
        console.info('statusDFU Success!', statusDFU);
        setUpdateStatus('finish');
        setProgress(0);
        sleep(1000);
        toast.show({
          placement: 'top',
          duration: 3000,
          render: () => {
            return (
              <Toast id={'dfuSuccessToast'} action="success" variant="accent">
                <VStack space="lg">
                  <ToastTitle>✅ Update is complete!</ToastTitle>
                  <ToastDescription>
                    Update is complete. Please wait a few seconds for BRU to
                    reboot.
                  </ToastDescription>
                </VStack>
              </Toast>
            );
          },
        });
        setDeviceDFU(null);
      } else {
        console.error('statusDFU error', statusDFU);
        setUpdateStatus('error');
        setProgress(0);
      }
      props.navigation.navigate('Settings');
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  return (
    <Wrapper {...props} style={s.wrapper}>
      <View style={s.container}>
        <Text style={s.mainText}>{getStatus(updateStatus)}</Text>
        {_renderProgressBar(parseInt(progress, 10))}
        <Text style={s.secondaryText}>
          Please do not disconnect your BRU machine from power until the
          firmware updated.
        </Text>
      </View>
    </Wrapper>
  );
};

const s = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 30,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '100%',
  },
  mainText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 18,
    marginBottom: 20,
  },
  secondaryText: {
    color: '#B0B0B0',
    fontWeight: '500',
    fontSize: 16,
    marginTop: 40,
    textAlign: 'center',
  },
});
