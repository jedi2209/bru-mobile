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
import {useNavigation} from '@react-navigation/native';
import {Button, ButtonText, HStack, FlatList} from '@gluestack-ui/themed';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useStore} from 'effector-react';
import {ActivityIndicator} from 'react-native-paper';
import DeviceInfo from 'react-native-device-info';

import {$deviceSettingsStore} from '@store/device';

import Wrapper from '@comp/Wrapper';

import {Device, sendDataCommand, sleep} from '@utils/device';

import {get} from 'lodash';
import {colors} from '@styleConst';

const SECONDS_TO_SCAN_FOR = 5;
const DEVICE_NAME_PREFIX = 'BRU';
const Buffer = require('buffer/').Buffer; // note: the trailing slash is important!

const deviceManager = new Device({
  prefix: DEVICE_NAME_PREFIX,
  secondsToScan: SECONDS_TO_SCAN_FOR,
  allowDuplicates: false,
});

const _renderItem = ({item, _onPressUpdate}) => {
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
        {/* <Button
          variant={'outline'}
          onPress={async () => {
            await deviceManager
              .handleReadData('firmwareRevision')
              .then(async res => {
                if (res) {
                  Alert.alert('firmwareRevision', res);
                  await sleep(1000);
                }
              })
              .catch(err => {
                console.error('handleReadData firmwareRevision', err);
              });
          }}>
          <Icon name="cog-refresh-outline" size={20} color="white" />
        </Button> */}
        <Button variant={'outline'} onPress={_onPressUpdate}>
          <Icon name="cog-refresh-outline" size={20} color="white" />
        </Button>
        <Button
          variant={'outline'}
          onPress={() => {
            Alert.alert(
              'Are you shure?',
              'After unpair device you should pair it again.',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'Unpair',
                  style: 'destructive',
                  onPress: async () =>
                    _unpairDevice(get(deviceManager, 'device.id', null)),
                },
              ],
            );
          }}>
          <Icon name="trash-can-outline" size={20} color="white" />
        </Button>
      </HStack>
    </HStack>
  );
};

const _unpairDevice = async () => {
  await deviceManager
    .removeBond()
    .then(res => {
      console.log('onPress Unpair device', res);
    })
    .catch(err => console.error('onPress Unpair device', err));
};

// resetDevice();

const SettingsScreen = props => {
  const devices = useStore($deviceSettingsStore);

  const [isLoading, setLoading] = useState(false);

  const {navigation} = props;

  useEffect(() => {
    setLoading(true);
    if (get(devices, 'length') === 1 && get(devices, '0.isCurrent', false)) {
      console.info('-------- device useEffect --------', devices);
      deviceManager.setCurrentDevice(devices[0]);
    }
    setTimeout(() => {
      setLoading(false);
    }, 500);
    console.info('++++++ device useEffect +++++', deviceManager.device);
    return () => {
      console.debug('[app] main component unmounting. Removing listeners...');
      if (typeof deviceManager !== 'undefined') {
        deviceManager.destructor();
      }
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

  return (
    <Wrapper {...props}>
      <Button
        size="lg"
        variant={'primary'}
        style={[styles.buttonStyle]}
        onPressIn={() => navigation.navigate('AddNewDeviceScreen')}>
        <ButtonText style={styles.buttonTextStyle}>Add BRU</ButtonText>
      </Button>
      {get(deviceManager, 'device', null) ? (
        <>
          <Text>Connected machines</Text>
          <FlatList
            data={devices}
            renderItem={({item}) => _renderItem({item, _onPressUpdate})}
            keyExtractor={item => item.id}
          />
          <Pressable
            style={styles.buttonStyle}
            onPress={async () => {
              setLoading(true);
              await deviceManager
                .handleReadData('hardwareRevision')
                .then(async res => {
                  if (res) {
                    Alert.alert('hardwareRevision', res);
                    await sleep(1000);
                  }
                  setLoading(false);
                })
                .catch(err => {
                  console.error('handleReadData hardwareRevision', err);
                });
            }}>
            <Text style={styles.buttonTextStyle}>
              {'Read hardwareRevision data'}
            </Text>
          </Pressable>
          {/* <Pressable
            style={styles.buttonStyle}
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
            <Text style={styles.buttonTextStyle}>{'Read modelName'}</Text>
          </Pressable> */}
          {/* <Pressable
            style={styles.buttonStyle}
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
            <Text style={styles.buttonTextStyle}>{'Read serialNumber'}</Text>
          </Pressable> */}
          {/* <Pressable
            style={[styles.buttonStyle, {backgroundColor: colors.green.mid}]}
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
            <Text style={styles.buttonTextStyle}>{'Get Machine setup'}</Text>
          </Pressable> */}
          {/* <Pressable
            style={[
              styles.buttonStyle,
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
            <Text style={styles.buttonTextStyle}>
              {!isBrewing ? 'Start Brew' : '== Stop Brew'}
            </Text>
          </Pressable> */}
          {/* <Pressable
          style={[styles.buttonStyle, {backgroundColor: colors.green.mid}]}
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
          <Text style={styles.buttonTextStyle}>
            {'Get test device status'}
          </Text>
        </Pressable> */}
        </>
      ) : null}
      <Text
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
      </Text>
    </Wrapper>
  );
};
const windowHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    height: windowHeight,
  },
  buttonStyle: {
    height: 55,
    alignItems: 'center',
    borderRadius: 20,
    marginHorizontal: '15%',
    marginVertical: 25,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
    textTransform: 'uppercase',
  },
});
export default SettingsScreen;
