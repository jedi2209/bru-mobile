import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';

import {DFUEmitter} from 'react-native-nordic-dfu';
import {
  VStack,
  Toast,
  ToastTitle,
  ToastDescription,
  Progress,
  ProgressFilledTrack,
  Text,
  useToast,
  Heading,
} from '@gluestack-ui/themed';
import CircularProgress from 'react-native-circular-progress-indicator';
import Wrapper from '@comp/Wrapper';

import {Device, deviceManager, sleep} from '@utils/device';
import {getFileURL, downloadFile} from '@utils/firmware';

import {get} from 'lodash';
import {colors} from '@styleConst';
// import {DEVICE_MANAGER_CONFIG} from '@const';

// const deviceManager = new Device(DEVICE_MANAGER_CONFIG);

const _renderProgressBar = value => {
  return (
    <Progress value={value} size="md">
      <ProgressFilledTrack bg="$primary500" />
    </Progress>
  );
};

const UpdateFirmwareProgressScreen = props => {
  const {navigation} = props;
  const {device, file} = props.route.params;

  const [progress, setProgress] = useState(0);
  const [isDownloading, setDownloading] = useState(false);
  const [updateStatus, setUpdateStatus] = useState(false);

  const toast = useToast();

  useEffect(() => {
    if (device && !updateStatus) {
      deviceManager.setCurrentDevice(device);
      _updateFirmware(file);
    }
    return () => {
      setUpdateStatus(false);
    };
  }, []);

  if (!get(device, 'id')) {
    navigation.goBack();
    return false;
  }

  const _updateFirmware = async file => {
    setDownloading(true);
    setUpdateStatus('start');
    const checkPermissions = await deviceManager._checkManager();
    // console.log('checkPermissions', checkPermissions);
    if (!checkPermissions) {
      await sleep(5000);
      const checkPermissionsSecond = await deviceManager._checkManager();
      // console.log('checkPermissionsSecond', checkPermissions);
      if (!checkPermissionsSecond) {
        toast.show({
          placement: 'top',
          duration: 5000,
          render: () => {
            return (
              <Toast
                id={'noPermissionsToast'}
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
            setUpdateStatus(false);
          },
        });
        setDownloading(false);
        setUpdateStatus(false);
        return false;
      }
    }
    toast.show({
      placement: 'top',
      duration: 5000,
      render: () => {
        return (
          <Toast action="info" id={'updateProcessToast'} variant="accent">
            <VStack space="lg">
              <ToastTitle>🔄 Download firmware</ToastTitle>
              <ToastDescription>
                Downloading firmware will take only a few seconds. Please do not
                close the app.
              </ToastDescription>
            </VStack>
          </Toast>
        );
      },
    });
    const filePath = await getFileURL('firmware/' + file);
    if (!filePath) {
      toast.closeAll();
      Alert.alert(
        'Error #1',
        "Sorry, we can't download firmware.\r\n\r\nPlease try again later.",
        [
          {
            text: 'OK',
            isPreferred: true,
            style: 'destructive',
            onPress: () => navigation.goBack(),
          },
        ],
      );
      setDownloading(false);
      setUpdateStatus(false);
      return false;
    }

    const fileDownloaded = await downloadFile(filePath, file).catch(err => {
      Alert.alert(
        'Error #2',
        "Sorry, we can't download firmware.\r\n\r\nPlease try again later.",
        [
          {
            text: 'OK',
            isPreferred: true,
            style: 'destructive',
            onPress: () => navigation.goBack(),
          },
        ],
      );
      setDownloading(false);
      setUpdateStatus(false);
      return false;
    });

    if (!fileDownloaded) {
      setDownloading(false);
      setUpdateStatus(false);
      Alert.alert(
        'Error #3',
        "Sorry, we can't download firmware.\r\n\r\nPlease try again later.",
      );
      console.error('fileDownloaded', fileDownloaded);
      return false;
    }
    console.info('fileDownloaded', fileDownloaded);
    setDownloading(false);
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
            onCloseComplete: () => {
              setUpdateStatus('finish');
            },
          });
          setUpdateStatus('finish');
          setProgress(0);
          break;
      }
    });
    console.info('DFUEmitter.addListener');
    setUpdateStatus('rebooting');
    console.info('Rebooting...');
    const statusDFU = await deviceManager.startDFU(fileDownloaded);
    if (statusDFU) {
      console.info('statusDFU Success!', statusDFU);
      setUpdateStatus('finish');
      setProgress(0);
    } else {
      console.error('statusDFU error', statusDFU);
      setUpdateStatus('error');
      setProgress(0);
    }
  };

  if (isDownloading) {
    return (
      <Wrapper {...props}>
        <ActivityIndicator
          size="medium"
          color="white"
          style={{marginTop: '20%'}}
        />
      </Wrapper>
    );
  }

  if (!updateStatus) {
    return null;
  }

  switch (updateStatus) {
    case 'start':
      return (
        <Wrapper {...props}>
          <View style={styles.statusWrapper}>
            <Text>Starting update process...</Text>
            <ActivityIndicator
              size="medium"
              color="white"
              style={{marginTop: '20%'}}
            />
          </View>
        </Wrapper>
      );
    case 'rebooting':
      return (
        <Wrapper {...props}>
          <View style={styles.statusWrapper}>
            <Text>Waiting for BRU to be ready for update...</Text>
            <ActivityIndicator
              size="medium"
              color="white"
              style={{marginTop: '20%'}}
            />
          </View>
        </Wrapper>
      );
    case 'finish':
      return (
        <Wrapper {...props}>
          <VStack style={styles.statusWrapper} space={'lg'}>
            <Heading>Update is complete!</Heading>
            <Text size={'xl'}>
              Please wait a few seconds for BRU to reboot.
            </Text>
            <CircularProgress
              value={0}
              initialValue={15}
              maxValue={15}
              inActiveStrokeOpacity={0.5}
              activeStrokeWidth={20}
              inActiveStrokeWidth={20}
              progressValueStyle={{fontWeight: '100', color: colors.white}}
              activeStrokeSecondaryColor={colors.green.main}
              duration={15000}
              // radius={120}
              // ref={progressRef}
              // inActiveStrokeColor="white"
              // dashedStrokeConfig={{
              //   count: 50,
              //   width: 4,
              // }}
              onAnimationComplete={() => navigation.pop(2)}
            />
          </VStack>
        </Wrapper>
      );
    case 'error':
      return (
        <Wrapper {...props}>
          <VStack style={styles.statusWrapper} space={'lg'}>
            <Heading>Update failed!</Heading>
            <Text size={'xl'}>
              Please wait a few seconds for BRU to reboot.
            </Text>
            <CircularProgress
              value={0}
              initialValue={25}
              maxValue={25}
              inActiveStrokeOpacity={0.5}
              activeStrokeWidth={20}
              inActiveStrokeWidth={20}
              progressValueStyle={{fontWeight: '100', color: colors.white}}
              activeStrokeSecondaryColor={colors.green.main}
              duration={25000}
              // radius={120}
              // ref={progressRef}
              // inActiveStrokeColor="white"
              // dashedStrokeConfig={{
              //   count: 50,
              //   width: 4,
              // }}
              onAnimationComplete={() => navigation.pop(2)}
            />
          </VStack>
        </Wrapper>
      );
    default:
      return (
        <Wrapper {...props}>
          <View style={styles.statusWrapper}>
            <VStack w={'100%'} justifyContent={'center'} alignItems={'center'}>
              <Heading>Updating firmware...</Heading>
              <Text size="lg" my={8}>
                {progress}%
              </Text>
              {_renderProgressBar(parseInt(progress, 10))}
            </VStack>
          </View>
        </Wrapper>
      );
  }
};

const styles = StyleSheet.create({
  statusWrapper: {
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    alignContent: 'center',
    textAlign: 'center',
    marginTop: 200,
    width: '100%',
    paddingHorizontal: '5%',
  },
  firmwareWrapper: {
    marginBottom: 10,
    borderRadius: 5,
    borderColor: colors.gray,
    borderWidth: 1,
    padding: 10,
  },
  firmwareWrapperLast: {
    marginBottom: 70,
  },
});

export default UpdateFirmwareProgressScreen;
