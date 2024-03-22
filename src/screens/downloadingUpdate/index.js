import React, {useState} from 'react';
import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import HeaderIcon from '../../core/components/icons/HeaderIcon';
import {basicStyles, colors} from '../../core/const/style';
import * as Progress from 'react-native-progress';

import {ProgressFilledTrack} from '../../../config/theme/ProgressFilledTrack';
import {DFUEmitter} from 'react-native-nordic-dfu';
import {ToastTitle, useToast} from '@gluestack-ui/themed';
import {Toast} from '../../../config/theme/Toast';
import {VStack} from '../../../config/theme/VStack';
import {ToastDescription} from '../../../config/theme/ToastDescription';

const s = StyleSheet.create({
  container: {
    backgroundColor: '#353535',
    height: '100%',
  },
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Platform.OS === 'ios' ? 70 : 44,
    height: '75%',
  },
  iconWrapper: {
    borderWidth: 16,
    borderColor: colors.green.mid,
  },
  progress: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloading: {
    textAlign: 'center',
    marginBottom: 30,
    color: colors.gray.lightGray,
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 24,
    letterSpacing: 0.4,
  },
  warning: {
    textAlign: 'center',
    marginTop: 30,
    color: '#B0B0B0',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
    letterSpacing: 0.4,
    marginHorizontal: 16,
  },
});

const UpdateScreen = props => {
  const {navigation} = props;
  const [progress, setProgress] = useState(0);
  const [isDownloading, setDownloading] = useState(false);
  const [updateStatus, setUpdateStatus] = useState(false);
  const toast = useToast();

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
        setUpdateStatus('Updating firmware...');
        break;
      case 'DEVICE_DISCONNECTING':
        console.info('DFUEmitter listener => DEVICE_DISCONNECTING');
        toast.show({
          placement: 'top',
          duration: 5000,
          render: () => {
            return (
              <Toast id={'dfuSuccessToast'} action="error" variant="accent">
                <VStack space="lg">
                  <ToastTitle>
                    Update firmware was canceled due to device disconnection!
                  </ToastTitle>
                  <ToastDescription>Update is not complete!</ToastDescription>
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

  return (
    <View style={s.container} {...props}>
      <View style={s.wrapper}>
        <View style={s.iconWrapper}>
          <HeaderIcon />
        </View>
        <View>
          <Text style={s.downloading}>Downloading BRU firmware</Text>
          <Progress value={progress} size="md">
            <ProgressFilledTrack bg="$primary500" />
          </Progress>
          <Text style={s.warning}>
            Please do not disconnect your BRU machine from power until the
            firmware updated.
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Settings', {
              screen: 'Settings',
              params: {previous_screen: 'DownloadingUpdate'},
            });
          }}
          style={basicStyles.backgroundButton}>
          <Text style={[basicStyles.backgroundButtonText, {width: 132}]}>
            Cancel
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default UpdateScreen;
