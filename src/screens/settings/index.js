import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {
  Button,
  ButtonText,
  HStack,
  Heading,
  ButtonGroup,
  Switch,
} from '@gluestack-ui/themed';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useStore} from 'effector-react';
import {ActivityIndicator} from 'react-native-paper';
import DeviceInfo from 'react-native-device-info';

import {$deviceSettingsStore, resetDevice} from '@store/device';

import Wrapper from '@comp/Wrapper';

import {Device, deviceManager, sendDataCommand, sleep} from '@utils/device';

import {get} from 'lodash';
import {colors, basicStyles} from '../../core/const/style';
import BruMachine from './components/BruMachine';

import ConfirmationModal from '../../core/components/ConfirmationModal';
import NotificationModal from '../../core/components/NotificationModal';
import {setSettingsModalOpen} from '../../core/store/device';
import {$themeStore} from '../../core/store/theme';
import CommonSettings from './components/CommonSettings';
import {logout} from '../../utils/auth';
import {setUser} from '../../core/store/user';

const Buffer = require('buffer/').Buffer; // note: the trailing slash is important!

// import {DEVICE_MANAGER_CONFIG} from '@const';
// const deviceManager = new Device(DEVICE_MANAGER_CONFIG);

const _renderItem = ({item, _onPressUpdate, _onPressUnpair}) => {
  return (
    <HStack key={item?.id} justifyContent={'space-between'}>
      <Text
        style={{
          color: 'white',
          backgroundColor: 'green',
          padding: 10,
          alignSelf: 'center',
          borderRadius: 5,
        }}>
        {item?.name}
      </Text>
      <HStack>
        <ButtonGroup space={'xl'}>
          <Button
            variant={'solid'}
            action={'secondary'}
            onPress={_onPressUpdate}>
            <Icon name="cog-refresh" size={20} color="white" />
          </Button>
          <Button
            variant={'solid'}
            action={'negative'}
            onPress={() => {
              Alert.alert(
                'Are you sure?',
                'After unpair device you should pair it again.',
                [
                  {
                    text: 'Cancel',
                    style: 'cancel',
                  },
                  {
                    text: 'Unpair',
                    style: 'destructive',
                    onPress: () =>
                      _onPressUnpair(get(deviceManager, 'device.id', null)),
                  },
                ],
              );
            }}>
            <Icon name="trash-can-outline" size={20} color="white" />
          </Button>
        </ButtonGroup>
      </HStack>
    </HStack>
  );
};

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

  const _onPressUnpair = async () => {
    setLoading(true);
    await deviceManager
      .removeBond()
      .then(res => {
        setLoading(false);
        // console.info('onPress Unpair device', res);
      })
      .catch(err => {
        setLoading(false);
        console.error('onPress Unpair device', err);
      });
  };

  return (
    <Wrapper style={s.wrapper} {...props}>
      <Text style={[s.screenTitle, isDarkMode && basicStyles.darkText]}>
        Settings
      </Text>
      <View>
        <Text style={[s.h2, isDarkMode && basicStyles.darkText]}>
          Connected machines
        </Text>
        {[1, 2].map(item => {
          return <BruMachine key={item} />;
        })}
      </View>
      <Button
        size="lg"
        variant={'primary'}
        style={[s.buttonStyle]}
        onPressIn={() => navigation.navigate('AddNewDeviceScreen')}>
        <ButtonText style={s.buttonTextStyle}>Connect New Machine</ButtonText>
      </Button>
      <Button
        onPress={() => setIsConfirmModalOpen(true)}
        size="lg"
        variant={'primary'}
        style={[
          s.buttonStyle,
          s.updateButton,
          isDarkMode && s.updateButtonDark,
        ]}
        // onPressIn={() => navigation.navigate('AddNewDeviceScreen')}
      >
        <ButtonText
          style={[
            s.buttonTextStyle,
            s.updateButtonText,
            isDarkMode && s.darkTextMain,
          ]}>
          Update BRÜ firmware
        </ButtonText>
      </Button>

      <TouchableOpacity
        onPress={async () => {
          await logout();
          await setUser(null);
          navigation.navigate('Authorization');
        }}>
        <Text>LOGOUT</Text>
      </TouchableOpacity>

      <CommonSettings />

      {/* {get(deviceManager, 'device', null) ? (
        <>
          <Heading mb={16}>My BRU</Heading>
          <FlatList
            data={devices}
            renderItem={({item}) =>
              _renderItem({item, _onPressUpdate, _onPressUnpair})
            }
            keyExtractor={item => item.id}
          />
          <View>
            <Pressable
              style={s.buttonStyle}
              onPress={async () => {
                setLoading(true);
                await deviceManager
                  .handleReadData('modelName')
                  .then(async res => {
                    if (res) {
                      Alert.alert('modelName', res);
                      await sleep(1000);
                    }
                    setLoading(false);
                  })
                  .catch(err => {
                    console.error('handleReadData modelName', err);
                  });
              }}>
              <Text style={s.buttonTextStyle}>{'Read modelName'}</Text>
            </Pressable>
            <Pressable
              style={s.buttonStyle}
              onPress={async () => {
                setLoading(true);
                await deviceManager
                  .handleReadData('serialNumber')
                  .then(async res => {
                    if (res) {
                      Alert.alert('serialNumber', res);
                      await sleep(1000);
                    }
                    setLoading(false);
                  })
                  .catch(err => {
                    console.error('handleReadData serialNumber', err);
                  });
              }}>
              <Text style={s.buttonTextStyle}>{'Read serialNumber'}</Text>
            </Pressable>
            <Pressable
              style={[s.buttonStyle, {backgroundColor: colors.green.mid}]}
              onPress={async () => {
                setLoading(true);
                const command = sendDataCommand(0xb6);
                await deviceManager
                  .writeValueAndNotify(Buffer(command).toJSON().data)
                  .then(async () => {
                    await sleep(1500);
                    setLoading(false);
                  })
                  .catch(err => {
                    console.error('Get Machine setup', err);
                  });
              }}>
              <Text style={s.buttonTextStyle}>{'Get Machine setup'}</Text>
            </Pressable>
            <Pressable
              style={[
                s.buttonStyle,
                {backgroundColor: isBrewing ? 'red' : colors.green.mid},
              ]}
              onPress={async () => {
                setLoading(true);
                const command = sendDataCommand(
                  0xb1,
                  new Uint8Array([!isBrewing ? 0x01 : 0x00]),
                  1,
                );
                await deviceManager
                  .writeValueAndNotify(Buffer(command).toJSON().data)
                  .then(async () => {
                    await sleep(2000);
                    setBrewing(!isBrewing);
                    setLoading(false);
                  })
                  .catch(err => {
                    console.error('Start Brewing error', err);
                  });
              }}>
              <Text style={s.buttonTextStyle}>
                {!isBrewing ? 'Start Brew' : '== Stop Brew'}
              </Text>
            </Pressable>
            <Pressable
              style={[s.buttonStyle, {backgroundColor: colors.green.mid}]}
              onPress={async () => {
                const buff = Buffer.from('FF04E5CS', 'hex');
                setLoading(true);
                // 0xFF, 0x04, 0xE5, 0xCS
                const command = sendDataCommand(0xe5);
                console.log(
                  'Buffer(command).toJSON()',
                  // bufferToHex(buff.toJSON().data),
                  bufferToHex(Buffer(command).toJSON().data),
                );
                await deviceManager
                  .writeValueAndNotify(Buffer(command).toJSON().data)
                  // .writeValueAndNotify(buff.toJSON().data)
                  .then(async res => {
                    setLoading(false);
                  })
                  .catch(err => {
                    console.error('Test device error', err);
                    setLoading(false);
                  });
              }}>
              <Text style={s.buttonTextStyle}>{'Get test device status'}</Text>
            </Pressable>
          </View>
        </>
      ) : null} */}
      {/* <Text
        selectable={false}
        style={{
          alignSelf: 'center',
          color: isDarkMode ? colors.gray.dark : colors.black,
          opacity: 0.2,
          marginTop: 40,
        }}>
        {'ver. ' +
          DeviceInfo.getVersion() +
          ' (' +
          DeviceInfo.getBuildNumber() +
          ')'}
      </Text> */}
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
