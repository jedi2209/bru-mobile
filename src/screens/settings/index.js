import React, {useState, useEffect, useCallback} from 'react';
import {Text, View, StyleSheet, Dimensions} from 'react-native';
import {
  Button,
  ButtonText,
  Toast,
  ToastTitle,
  VStack,
  useToast,
} from '@gluestack-ui/themed';

import {useStore} from 'effector-react';
import {ActivityIndicator} from 'react-native-paper';

import {$deviceSettingsStore, resetDevice} from '@store/device';

import Wrapper from '@comp/Wrapper';

import {deviceManager} from '@utils/device';

import {get} from 'lodash';
import {colors, basicStyles} from '../../core/const/style';
import BruMachine from './components/BruMachine';

import ConfirmationModal from '../../core/components/ConfirmationModal';
import NotificationModal from '../../core/components/NotificationModal';
import {setSettingsModalOpen} from '../../core/store/device';
import {$themeStore} from '../../core/store/theme';
import CommonSettings from './components/CommonSettings';

// import {DEVICE_MANAGER_CONFIG} from '@const';
// const deviceManager = new Device(DEVICE_MANAGER_CONFIG);

// const _renderItem = ({item, _onPressUpdate, _onPressUnpair}) => {
//   return (
//     <HStack key={item?.id} justifyContent={'space-between'}>
//       <Text
//         style={{
//           color: 'white',
//           backgroundColor: 'green',
//           padding: 10,
//           alignSelf: 'center',
//           borderRadius: 5,
//         }}>
//         {item?.name}
//       </Text>
//       <HStack>
//         <ButtonGroup space={'xl'}>
//           <Button
//             variant={'solid'}
//             action={'secondary'}
//             onPress={_onPressUpdate}>
//             <Icon name="cog-refresh" size={20} color="white" />
//           </Button>
//           <TouchableOpacity
//             onPress={() => {
//               Alert.alert(
//                 'Are you sure?',
//                 'After unpair device you should pair it again.',
//                 [
//                   {
//                     text: 'Cancel',
//                     style: 'cancel',
//                   },
//                   {
//                     text: 'Unpair',
//                     style: 'destructive',
//                     onPress: () =>
//                       _onPressUnpair(get(deviceManager, 'device.id', null)),
//                   },
//                 ],
//               );
//             }}>
//             <Icon name="trash-can-outline" size={20} color="white" />
//           </TouchableOpacity>
//         </ButtonGroup>
//       </HStack>
//     </HStack>
//   );
// };

// resetDevice();

const SettingsScreen = props => {
  const devices = useStore($deviceSettingsStore);

  const [isLoading, setLoading] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const theme = useStore($themeStore);
  const isDarkMode = theme === 'dark';
  const settingsStore = useStore($deviceSettingsStore);
  const notificationModalOpened = settingsStore.isOpenModal;
  const {navigation} = props;
  const toast = useToast();

  useEffect(() => {
    setLoading(true);
    if (get(devices, 'length') === 1 && get(devices, '0.isCurrent', false)) {
      deviceManager.setCurrentDevice(devices[0]);
    }
    setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => {
      // console.debug('[app] main component unmounting. Removing listeners...');
      // if (typeof deviceManager !== 'undefined') {
      //   deviceManager.destructor();
      // }
    };
  }, [devices]);

  if (isLoading) {
    return (
      <Wrapper {...props}>
        <ActivityIndicator
          size="large"
          color="white"
          style={{marginTop: '20%'}}
        />
      </Wrapper>
    );
  }

  const _onPressUpdate = () => {
    navigation.navigate('UpdateFirmwareScreen', {device: deviceManager.device});
  };

  return (
    <Wrapper style={s.wrapper} {...props}>
      <Text style={[s.screenTitle, isDarkMode && basicStyles.darkText]}>
        Settings
      </Text>
      <View>
        {devices.lenght ? (
          <>
            <Text style={[s.h2, isDarkMode && basicStyles.darkText]}>
              Connected machines
            </Text>
            {devices.map(item => {
              return <BruMachine key={item} item={item} />;
            })}
          </>
        ) : null}
      </View>
      <Button
        size="lg"
        variant={'primary'}
        style={[s.buttonStyle]}
        onPressIn={() => navigation.navigate('AddNewDeviceScreen')}>
        <ButtonText style={s.buttonTextStyle}>Connect New Machine</ButtonText>
      </Button>
      <Button
        onPress={() => {
          if (!devices.lenght) {
            toast.show({
              placement: 'top',
              duration: 5000,
              render: () => {
                return (
                  <Toast
                    id={'noPermissionsToast'}
                    action="error"
                    variant="accent">
                    <VStack space="lg">
                      <ToastTitle fontSize={'$md'}>
                        To update the firmware, you need to connect to the
                        device
                      </ToastTitle>
                    </VStack>
                  </Toast>
                );
              },
              onCloseComplete: () => {},
            });
            return;
          }
          _onPressUpdate();
        }}
        size="lg"
        variant={'primary'}
        style={[
          s.buttonStyle,
          s.updateButton,
          isDarkMode && s.updateButtonDark,
        ]}>
        <ButtonText
          style={[
            s.buttonTextStyle,
            s.updateButtonText,
            isDarkMode && s.darkTextMain,
          ]}>
          Update BRÜ firmware
        </ButtonText>
      </Button>

      <CommonSettings />

      <ConfirmationModal
        onConfirm={() => {
          navigation.navigate('DownloadingUpdate');
          setIsConfirmModalOpen(false);
        }}
        opened={isConfirmModalOpen}
        closeModal={() => setIsConfirmModalOpen(false)}
        withCancelButton
        cancelButtonText="No"
        confirmationButtonText="Confirm"
        modalTitle="Firmware update"
        confirmationText="The BRU app will download and install the latest firmware to your BRU machine. Please make sure you are connected to Wi Fi to avoid additional charges."
      />
      <NotificationModal
        opened={notificationModalOpened}
        closeModal={() => setSettingsModalOpen(false)}
        modalTitle="Firmware successfully updated to ver. 12.423.4"
      />
    </Wrapper>
  );
};
const windowHeight = Dimensions.get('window').height;
const s = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 14,
  },
  screenTitle: {
    color: colors.gray.grayDarkText,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 24,
    letterSpacing: 0.4,
    marginBottom: 20,
    marginTop: 30,
  },
  darkTextMain: {
    color: colors.white,
  },
  h2: {
    color: colors.gray.grayDarkText,
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
    letterSpacing: 0.4,
    marginBottom: 10,
  },
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    height: windowHeight,
  },
  buttonStyle: {
    height: 55,
    alignItems: 'center',
    borderRadius: 90,
    marginHorizontal: '15%',
    marginBottom: 10,
    marginTop: 20,
    backgroundColor: colors.green.mid,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  updateButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    marginBottom: 13,
    borderColor: colors.green.mid,
  },
  updateButtonText: {
    color: colors.green.mid,
    textAlign: 'center',
  },
  updateButtonDark: {
    backgroundColor: 'rgba(42, 42, 42, 0.40)',
  },
  filterStatus: {
    ...basicStyles.rowBetween,
    paddingVertical: 16,
  },
  bottomBorder: {
    borderBottomColor: colors.gray.grayLightText,
    borderBottomWidth: 1,
  },
  title: {
    color: colors.gray.grayDarkText,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 24,
    letterSpacing: 0.4,
  },
  subTitle: {
    fontSize: 12,
    color: '#999',
    fontWeight: '600',
    lineHeight: 24,
    letterSpacing: 0.4,
  },
});
export default SettingsScreen;
