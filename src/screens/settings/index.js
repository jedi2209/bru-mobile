import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  useColorScheme,
  TouchableOpacity,
  Pressable,
  Alert,
} from 'react-native';
import {
  Button,
  ButtonText,
  HStack,
  FlatList,
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
import Collapsible from 'react-native-collapsible';
import ConfirmationModal from '../../core/components/ConfirmationModal';
import BruStoreModal from '../../core/components/BruStoreModal';

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
  const [coldTea, setColdTea] = useState(false);
  const [autoRinse, setAutoRinse] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selected, setSelected] = useState('small');

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

  const isDarkMode = useColorScheme() === 'dark';

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

      <View style={[s.filterStatus, s.bottomBorder]}>
        <View>
          <Text style={[s.title, isDarkMode && s.darkTextMain]}>
            Filter Status
          </Text>
          <Text style={s.filterNotification}>
            Please replace the water filter
          </Text>
          <TouchableOpacity>
            <Text
              style={[s.filterTutorial, isDarkMode && s.filterTutorialDark]}>
              View tutorial video
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={[s.title, s.filterHealth]}>Health 85%</Text>
      </View>
      <View style={[s.filterStatus, s.bottomBorder]}>
        <View>
          <Text style={[s.title, isDarkMode && s.darkTextMain]}>Cold tea</Text>
          <Text style={s.subTitle}>
            {coldTea
              ? 'Add cold water to every tea you make. You may need to add more tea because of water diffusion.'
              : 'Add cold water to every tea you make'}
          </Text>
        </View>
        <Switch
          value={coldTea}
          onChange={() => setColdTea(prev => !prev)}
          sx={{
            props: {
              trackColor: {
                true: colors.green.mid,
              },
            },
          }}
        />
      </View>
      <View style={[s.bottomBorder, {}]}>
        <View style={[s.filterStatus, {paddingTop: 16, paddingBottom: 11}]}>
          <Text style={[s.title, isDarkMode && s.darkTextMain]}>
            Auto-rinse
          </Text>
          <Switch
            value={autoRinse}
            onChange={() => setAutoRinse(prev => !prev)}
            sx={{
              props: {
                trackColor: {
                  true: colors.green.mid,
                },
              },
            }}
          />
        </View>
        <Collapsible collapsed={!autoRinse} style={s.autoRinse}>
          <View>
            <Text style={[s.unitTitle, s.darkTextMain]}>Water amount</Text>
            <View style={s.units}>
              <TouchableOpacity
                onPress={() => setSelected('small')}
                style={[
                  s.unit,
                  isDarkMode && s.darkUnit,
                  s.unitLeft,
                  selected === 'small' && s.selected,
                ]}>
                <Text style={[s.unitText, selected === 'small' && s.selected]}>
                  Small
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setSelected('medium')}
                style={[
                  s.unit,
                  isDarkMode && s.darkUnit,
                  selected === 'medium' && s.selected,
                ]}>
                <Text style={[s.unitText]}>Medium</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setSelected('large')}
                style={[
                  s.unit,
                  isDarkMode && s.darkUnit,
                  s.unitRight,
                  selected === 'large' && s.selected,
                ]}>
                <Text style={s.unitText}>Large</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View>
            <Text style={[s.unitTitle, s.darkTextMain]}>Dispence to</Text>
            <View style={s.units}>
              <TouchableOpacity
                style={[
                  s.unit,
                  isDarkMode && s.darkUnit,

                  s.unitLeft,
                  s.selected,
                ]}>
                <Text style={s.unitText}>Tray</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.unit, isDarkMode && s.darkUnit, s.unitRight]}>
                <Text style={s.unitText}>Cup</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Collapsible>
      </View>
      <View style={[s.filterStatus, s.bottomBorder]}>
        <Text style={[s.title, isDarkMode && s.darkTextMain]}>Units</Text>
        <View style={s.units}>
          <TouchableOpacity
            style={[s.unit, isDarkMode && s.darkUnit, s.unitLeft, s.selected]}>
            <Text style={s.unitText}>°C - ml</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.unit, isDarkMode && s.darkUnit, s.unitRight]}>
            <Text style={s.unitText}>°F - oz</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={[s.filterStatus, s.bottomBorder]}>
        <Text style={[s.title, isDarkMode && s.darkTextMain]}>
          Notifications
        </Text>
        <Switch
          sx={{
            props: {
              trackColor: {
                true: colors.green.mid,
              },
            },
          }}
        />
      </View>
      <View style={[s.filterStatus, s.bottomBorder]}>
        <Text style={[s.title, isDarkMode && s.darkTextMain]}>
          App color theme
        </Text>
        <View style={s.units}>
          <TouchableOpacity
            style={[s.unit, isDarkMode && s.darkUnit, s.unitLeft, s.selected]}>
            <Text style={s.unitText}>Dark</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.unit, isDarkMode && s.darkUnit, s.unitRight]}>
            <Text style={s.unitText}>Light</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={[s.filterStatus, s.bottomBorder]}>
        <Text style={[s.title, isDarkMode && s.darkTextMain]}>About</Text>
      </View>
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
        opened={isConfirmModalOpen}
        closeModal={() => setIsConfirmModalOpen(false)}
        withCancelButton
        cancelButtonText="No"
        confirmationButtonText="Confirm"
        modalTitle="Firmware update"
        confirmationText="The BRU app will download and install the latest firmware to your BRU machine. Please make sure you are connected to Wi Fi to avoid additional charges."
      />
    </Wrapper>
  );
};
const windowHeight = Dimensions.get('window').height;
const s = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 14,
    marginVertical: 30,
  },
  screenTitle: {
    color: colors.gray.grayDarkText,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 24,
    letterSpacing: 0.4,
    marginBottom: 20,
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
  filterHealth: {color: colors.green.mid, lineHeight: 16},
  unitTitle: {
    color: colors.gray.grayDarkText,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
    letterSpacing: 0.4,
    textAlign: 'center',
    marginBottom: 10,
  },
  units: {
    ...basicStyles.row,
  },
  unit: {
    backgroundColor: '#C5C5C8',
    paddingHorizontal: 10,
    paddingVertical: 11,
  },
  darkUnit: {
    backgroundColor: '#555558',
  },
  unitText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 16,
    letterSpacing: 0.4,
  },
  unitLeft: {
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  unitRight: {
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  selected: {
    backgroundColor: colors.green.mid,
  },
  autoRinse: {
    ...basicStyles.rowBetween,
    paddingBottom: 16,
  },
  filterNotification: {
    color: '#999',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 18,
    letterSpacing: 0.4,
  },
  filterTutorial: {
    color: colors.green.mid,
    textDecorationLine: 'underline',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 18,
    letterSpacing: 0.4,
  },
  filterTutorialDark: {
    color: '#FFF',
  },
});
export default SettingsScreen;
