import React, {useState, useEffect} from 'react';
import {Text, View, StyleSheet, Alert, useColorScheme} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import {createProgress} from '@gluestack-ui/progress';
import {
  Root,
  FilledTrack,
} from '../../gluestack/core/Progress/styled-components';

import {DFUEmitter} from 'react-native-nordic-dfu';
import {HStack, Pressable, Button, VStack, Toast, useToast} from '@gluestack';
import {useStore} from 'effector-react';
import {$deviceSettingsStore} from '@store/device';
import {$currentFirmwareStore} from '@store/firmware';
import {$langSettingsStore} from '@store/lang';
import Wrapper from '@comp/Wrapper';

import {Device, sleep} from '@utils/device';
import {getFileURL, downloadFile, getTextFromFirmware} from '@utils/firmware';

import {get} from 'lodash';
import {tabBarStyle, colors} from '@styleConst';

const SECONDS_TO_SCAN_FOR = 2;
const DEVICE_NAME_PREFIX = 'BRU';
const Buffer = require('buffer/').Buffer; // note: the trailing slash is important!

const deviceManager = new Device({
  prefix: DEVICE_NAME_PREFIX,
  secondsToScan: SECONDS_TO_SCAN_FOR,
  allowDuplicates: false,
});

const _renderProgressBar = value => {
  const Progress = createProgress({
    Root,
    FilledTrack,
  });
  return (
    <Progress value={value} h="$1">
      <Progress.FilledTrack h="$1" bg="$primary500" />
    </Progress>
  );
};

const _renderProgress = (updateStatus, progress) => {
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
          <Text>Update Complete!</Text>
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
  const device = useStore($deviceSettingsStore);
  const firmware = useStore($currentFirmwareStore);
  const lang = useStore($langSettingsStore);
  if (device) {
    deviceManager.setCurrentDevice(device);
  }

  const phoneTheme = useColorScheme();
  const [progress, setProgress] = useState(0);
  const [isDownloading, setDownloading] = useState(false);
  const [updateStatus, setUpdateStatus] = useState(false);

  const toast = useToast();

  const _updateFirmware = async (itemID, file) => {
    setDownloading(itemID);
    setUpdateStatus('start');
    toast.show({
      placement: 'top',
      duration: 5000,
      render: ({id}) => {
        return (
          <Toast nativeId={id} action="info" variant="accent">
            <VStack space="lg">
              <Toast.Title>🔄 Download firmware</Toast.Title>
              <Toast.Description>
                Downloading firmware will take only a few seconds. Please do not
                close the app.
              </Toast.Description>
            </VStack>
          </Toast>
        );
      },
    });
    const filePath = await getFileURL('firmware/' + file).catch(err => {
      console.error('getFileURL', err);
      setDownloading(false);
      setUpdateStatus(false);
      toast.show({
        placement: 'top',
        duration: 5000,
        render: ({id}) => {
          return (
            <Toast nativeId={id} action="error" variant="accent">
              <VStack space="lg">
                <Toast.Title>😢 Error</Toast.Title>
                <Toast.Description>
                  Sorry, we can't download firmware. Please try again later.
                </Toast.Description>
              </VStack>
            </Toast>
          );
        },
      });
      return false;
    });
    const fileDownloaded = await downloadFile(filePath, file).catch(err => {
      console.error('downloadFile', err);
      setDownloading(false);
      setUpdateStatus(false);
      return false;
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
            setUpdateStatus('finish');
            setProgress(0);
            break;
        }
      });
      deviceManager.startDFU(fileDownloaded).then(finish => {
        toast.show({
          placement: 'top',
          duration: 5000,
          render: ({id}) => {
            return (
              <Toast nativeId={id} action="success" variant="accent">
                <VStack space="lg">
                  <Toast.Title>✅ Update is complete!</Toast.Title>
                  <Toast.Description>
                    Update is complete. Please wait a few seconds for BRU to
                    reboot.
                  </Toast.Description>
                </VStack>
              </Toast>
            );
          },
          onCloseComplete: () => {
            setUpdateStatus(false);
          },
        });
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
          <Text>{[name, itemID].join(' -- ')}</Text>
          <Text>
            {[descriptionBase, descriptionBugFix, descriptionFeatures].join(
              '\n\n',
            )}
          </Text>
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

  if (!get(firmware, 'data', null) || isDownloading) {
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
    <Wrapper {...props}>
      {updateStatus
        ? _renderProgress(updateStatus, progress)
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
