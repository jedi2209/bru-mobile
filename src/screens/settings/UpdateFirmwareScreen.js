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
import {languages} from '../../helpers/hasTranslation';
import {useStore} from 'effector-react';
import {$langSettingsStore} from '../../core/store/lang';
import {useTranslation} from 'react-i18next';

const _renderProgressBar = value => {
  return (
    <Progress value={value} size="md">
      <ProgressFilledTrack bg="$primary500" />
    </Progress>
  );
};

export const UpdateFirmwareScreen = props => {
  const {fileName, filePath} = props.route.params;
  const [progress, setProgress] = useState(0);
  const [updateStatus, setUpdateStatus] = useState('start');
  const [downloadedFile, setDownloadedFile] = useState(null);
  const lang = useStore($langSettingsStore);
  const langIndex = languages.findIndex(item => item === lang);
  const {t} = useTranslation();

  const getStatus = status => {
    switch (status) {
      case 'start':
        return t('UpdateFirmware.Downloading');
      case 'connecting':
        return t('UpdateFirmware.Connecting');
      case 'final':
        return t('UpdateFirmware.Success');
      case 'error':
        return t('UpdateFirmware.Error');
      case 'updating':
        return t('UpdateFirmware.Updating');
      default:
        break;
    }
  };

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

      const command = getCommand(0x27, [langIndex === -1 ? 0 : langIndex], 5);
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
        toast.show({
          placement: 'top',
          duration: 3000,
          render: () => {
            return (
              <Toast id={'dfuSuccessToast'} action="error" variant="accent">
                <VStack space="lg">
                  <ToastTitle>{t('UpdateFirmware.CantDownload')}</ToastTitle>
                </VStack>
              </Toast>
            );
          },
        });
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
                  <ToastTitle>{t('UpdateFirmware.UpdateCompleted')}</ToastTitle>
                  <ToastDescription>
                    {t('UpdateFirmware.UpdateCompletedDesc')}
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
        <Text style={s.secondaryText}>{t('UpdateFirmware.PleaseDont')}</Text>
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
