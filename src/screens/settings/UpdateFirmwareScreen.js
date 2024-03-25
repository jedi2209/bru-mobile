import React, {useEffect, useState} from 'react';
import Wrapper from '../../core/components/Wrapper';
import {useStore} from 'effector-react';
import {$connectedDevice} from '../../core/store/connectedDevice';
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
import {getCommand} from '../../utils/commands';

export const UpdateFirmwareScreen = props => {
  const {fileName, filePath} = props.route.params;
  const [progress, setProgress] = useState(0);
  const [isDownloading, setDownloading] = useState(false);
  const [updateStatus, setUpdateStatus] = useState(false);
  const [needUpdate, setNeedUpdate] = useState(false);

  const currentDevice = useStore($connectedDevice);
  const toast = useToast();
  const {writeValueWithResponse, deviceDFU, scanDFU, connectToDFU, startDFU} =
    useBle();

  useEffect(() => {
    async function start() {
      const command = getCommand(0x27, [], 4);
      await writeValueWithResponse(command);
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
      const fileDownloaded = await downloadFile(filePath, fileName);
      if (!fileDownloaded) {
        console.log('No file downloaded');
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
            console.info('DFUEmitter listener => DEVICE_DISCONNECTING');
            toast.show({
              placement: 'top',
              duration: 5000,
              render: () => {
                return (
                  <Toast
                    id={'dfuSuccessToast'}
                    action="success"
                    variant="accent">
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
              onCloseComplete: () => {
                setUpdateStatus('finish');
              },
            });
            setUpdateStatus('finish');
            setProgress(0);
            break;
        }
      });
      const statusDFU = await startDFU(fileDownloaded);
      if (statusDFU) {
        console.info('statusDFU Success!', statusDFU);
        setUpdateStatus('finish');
        setProgress(0);
      } else {
        console.error('statusDFU error', statusDFU);
        setUpdateStatus('error');
        setProgress(0);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Wrapper {...props} style={s.wrapper}>
      <View style={s.container}>
        <Text style={s.mainText}>Downloading BRU firmware</Text>
        <Progress value={parseInt(progress, 10)} size="md">
          <ProgressFilledTrack bg="$" />
        </Progress>
        <Text style={s.secondaryText}>
          Please do not disconnect your BRU machine from power until the
          firmware updated. {progress}
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
