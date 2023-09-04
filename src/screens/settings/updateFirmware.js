import React, {useState, useEffect} from 'react';
import {RefreshControl, View, StyleSheet, Alert} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';

import {DFUEmitter} from 'react-native-nordic-dfu';
import {
  Button,
  VStack,
  Toast,
  ToastTitle,
  ToastDescription,
  Progress,
  ProgressFilledTrack,
  Text,
  useToast,
} from '@gluestack-ui/themed';
import {useStore} from 'effector-react';
import {$deviceSettingsStore} from '@store/device';
import {$currentFirmwareStore} from '@store/firmware';
import {$langSettingsStore} from '@store/lang';
import Wrapper from '@comp/Wrapper';

import {Device, sleep} from '@utils/device';
import {
  fetchFirmwareMeta,
  getFileURL,
  downloadFile,
  getTextFromFirmware,
} from '@utils/firmware';

import {get} from 'lodash';
import {colors} from '@styleConst';

const SECONDS_TO_SCAN_FOR = 2;
const DEVICE_NAME_PREFIX = 'BRU';
const Buffer = require('buffer/').Buffer; // note: the trailing slash is important!

const deviceManager = new Device({
  prefix: DEVICE_NAME_PREFIX,
  secondsToScan: SECONDS_TO_SCAN_FOR,
  allowDuplicates: false,
});

const _renderProgressBar = value => {
  // const Progress = createProgress({
  //   Root,
  //   FilledTrack,
  // });
  return (
    <Progress value={value} h="$1">
      <ProgressFilledTrack h="$1" bg="$primary500" />
    </Progress>
  );
};

const _renderProgress = (updateStatus, progress, props) => {
  if (!updateStatus) {
    return null;
  }
  switch (updateStatus) {
    case 'start':
      return (
        <View style={styles.statusWrapper}>
          <Text>Starting update process...</Text>
          <ActivityIndicator
            size="medium"
            color="white"
            style={{marginTop: '20%'}}
          />
        </View>
      );
    case 'rebooting':
      return (
        <View style={styles.statusWrapper}>
          <Text>Waiting for BRU to be ready for update...</Text>
          <ActivityIndicator
            size="medium"
            color="white"
            style={{marginTop: '20%'}}
          />
        </View>
      );
    case 'finish':
      return (
        <View style={styles.statusWrapper}>
          <Text>Update is complete!</Text>
          <Text>Please wait a few seconds for BRU to reboot.</Text>
          <Button
            mt="$4"
            size="lg"
            onPress={() => {
              props.navigation.goBack();
            }}>
            <Button.Text>Hurra!🎉</Button.Text>
          </Button>
        </View>
      );
    default:
      return (
        <View style={styles.statusWrapper}>
          <VStack w={'100%'}>
            <Text>Updating firmware...</Text>
            <Text size="lg">{progress}%</Text>
            {_renderProgressBar(parseInt(progress, 10))}
          </VStack>
        </View>
      );
  }
};

const UpdateFirmwareScreen = props => {
  let device = useStore($deviceSettingsStore);
  if (!get(device, 'id', false) && get(props, 'route.params.device', false)) {
    device = props.route.params.device;
  }
  const firmware = useStore($currentFirmwareStore);
  const lang = useStore($langSettingsStore);
  if (device && device?.id) {
    deviceManager.setCurrentDevice(device);
  }

  const [progress, setProgress] = useState(0);
  const [isDownloading, setDownloading] = useState(false);
  const [isRefreshing, setRefreshing] = useState(false);
  const [updateStatus, setUpdateStatus] = useState(false);

  const toast = useToast();

  if (!device || !device?.id) {
    props.navigation.goBack();
    return false;
  }

  const _updateFirmware = async (itemID, file) => {
    setDownloading(itemID);
    setUpdateStatus('start');
    const checkPermissions = await deviceManager._checkManager();
    console.log('checkPermissions', checkPermissions);
    if (!checkPermissions) {
      await sleep(5000);
      const checkPermissionsSecond = await deviceManager._checkManager();
      console.log('checkPermissionsSecond', checkPermissions);
      if (!checkPermissionsSecond) {
        toast.show({
          placement: 'top',
          duration: 5000,
          render: ({id}) => {
            return (
              <Toast nativeId={id} action="success" variant="accent">
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
      render: ({id}) => {
        return (
          <Toast nativeId={id} action="info" variant="accent">
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
    const filePath = await getFileURL('firmware/' + file).catch(err => {
      toast.show({
        placement: 'top',
        duration: 5000,
        render: ({id}) => {
          return (
            <Toast nativeId={id} action="error" variant="accent">
              <VStack space="lg">
                <ToastTitle>😢 Error</ToastTitle>
                <ToastDescription>
                  Sorry, we can't download firmware. Please try again later.
                </ToastDescription>
              </VStack>
            </Toast>
          );
        },
      });
      setDownloading(false);
      setUpdateStatus(false);
    });
    const fileDownloaded = await downloadFile(filePath, file).catch(err => {
      setDownloading(false);
      setUpdateStatus(false);
    });
    if (fileDownloaded) {
      await sleep(6000);
      setDownloading(false);
      setUpdateStatus('rebooting');
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
            setUpdateStatus('updating');
            break;
          case 'DEVICE_DISCONNECTING':
            toast.show({
              placement: 'top',
              duration: 5000,
              render: ({id}) => {
                return (
                  <Toast nativeId={id} action="success" variant="accent">
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
      deviceManager.startDFU(fileDownloaded).then(async finishFirst => {
        if (!finishFirst) {
          const finishSecond = await deviceManager.startDFU(fileDownloaded);
          if (!finishSecond) {
            setUpdateStatus(false);
            setProgress(0);
          }
        }
      });
    } else {
      console.error('fileDownloaded', fileDownloaded);
    }
  };

  const _renderFirmware = () => {
    let i = 0;
    let isLast = false;
    return get(firmware, 'data', []).map(item => {
      const {id: itemID, description} = item;
      const file = get(item.file, lang, get(item.file, 'en', item.file));
      const name = get(item.name, lang, get(item.name, 'en', item.name));

      const descriptionBase = getTextFromFirmware(description, 'base', lang);
      const descriptionBugFix = getTextFromFirmware(
        description,
        'bugfix',
        lang,
      );
      const descriptionFeatures = getTextFromFirmware(
        description,
        'features',
        lang,
      );

      i++;

      if (i === get(firmware, 'data.length', null)) {
        isLast = true;
      }
      return (
        <View
          key={itemID}
          style={[
            styles.firmwareWrapper,
            isLast ? styles.firmwareWrapperLast : {},
          ]}>
          <Text fontSize={24}>{[name].join(' -- ')}</Text>
          {descriptionBase ? (
            <View style={{marginVertical: 8}}>
              <Text fontWeight="$bold">Base</Text>
              <Text>{descriptionBase}</Text>
            </View>
          ) : null}
          {descriptionFeatures ? (
            <View style={{marginVertical: 8}}>
              <Text fontWeight="$bold">New Features</Text>
              <Text>{descriptionFeatures}</Text>
            </View>
          ) : null}
          {descriptionBugFix ? (
            <View style={{marginVertical: 8}}>
              <Text fontWeight="$bold">Bugfix</Text>
              <Text>{descriptionBugFix}</Text>
            </View>
          ) : null}
          <Button
            size="md"
            variant="solid"
            action="primary"
            mt={4}
            isDisabled={false}
            isFocusVisible={false}
            onPress={async () => {
              Alert.alert(
                'Are you shure?',
                'This will update your BRU device. Please do not close the app.',
                [
                  {
                    text: 'Cancel',
                    style: 'cancel',
                  },
                  {
                    text: 'Update',
                    isPreferred: true,
                    style: 'destructive',
                    onPress: async () => _updateFirmware(itemID, file),
                  },
                ],
              );
            }}>
            <Button.Text>Update</Button.Text>
          </Button>
        </View>
      );
    });
  };

  const _onRefresh = async () => {
    setRefreshing(true);
    await fetchFirmwareMeta();
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  if (!get(firmware, 'data', null) || isDownloading || isRefreshing) {
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

  return (
    <Wrapper
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={_onRefresh}
          tintColor="#fff"
        />
      }
      {...props}>
      {updateStatus
        ? _renderProgress(updateStatus, progress, props)
        : _renderFirmware()}
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  statusWrapper: {
    justifyContent: 'center',
    alignSelf: 'center',
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

export default UpdateFirmwareScreen;
