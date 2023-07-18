import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  useColorScheme,
  TouchableOpacity,
  Pressable,
  FlatList,
  Alert,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {$deviceSettingsStore, resetDevice} from '@store/device';
import {useStore} from 'effector-react';
import {Device, sendDataCommand, sleep} from '@utils/device';
import {ActivityIndicator} from 'react-native-paper';
import {colors} from '@styleConst';

import Wrapper from '@comp/Wrapper';

const SECONDS_TO_SCAN_FOR = 2;
const DEVICE_NAME_PREFIX = 'BRU';
const Buffer = require('buffer/').Buffer; // note: the trailing slash is important!

const deviceManager = new Device({
  prefix: DEVICE_NAME_PREFIX,
  secondsToScan: SECONDS_TO_SCAN_FOR,
  allowDuplicates: false,
});

const SettingsScreen = props => {
  let device = useStore($deviceSettingsStore);
  if (device) {
    deviceManager.setCurrentDevice(device);
  }
  const [isScanning, setIsScanning] = useState(false);
  const [connected, setConnected] = useState(false);
  const [isBrewing, setBrewing] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [peripherals, setPeripherals] = useState(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => {
      console.debug('[app] main component unmounting. Removing listeners...');
      if (typeof deviceManager !== 'undefined') {
        deviceManager.destructor();
      }
    };
  }, []);

  const isDarkMode = useColorScheme() === 'dark';

  const searchDevices = async () => {
    resetDevice();
    setIsScanning(true);
    await deviceManager.handleAndroidPermissions().then(res => {
      if (res) {
        deviceManager.searchBleDevices();
        return sleep(3000).then(() => {
          setPeripherals(deviceManager.getPeripherals());
          setIsScanning(false);
        });
      } else {
        setIsScanning(false);
      }
    });
  };

  // render list of bluetooth devices
  const renderItem = ({item: item}) => {
    const color = item?.connected
      ? colors.green.mid
      : isDarkMode
      ? colors.brown
      : colors.gray.inactive;
    return (
      <TouchableOpacity
        onPress={async () => {
          setLoading(true);
          await deviceManager.connectToDevice(item.id).then(res => {
            setLoading(false);
          });
        }}>
        <View
          style={{
            backgroundColor: color,
            borderRadius: 5,
            paddingVertical: 5,
            marginHorizontal: 10,
            paddingHorizontal: 10,
          }}>
          <Text
            style={{
              fontSize: 18,
              textTransform: 'capitalize',
              color: isDarkMode ? colors.white : colors.black,
            }}>
            {item.name}
            {item.connecting && ' - Connecting...'}
          </Text>
          <View
            style={{
              backgroundColor: color,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: 14,
                color: isDarkMode ? colors.white : colors.black,
              }}>
              RSSI: {item.rssi}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: isDarkMode ? colors.white : colors.black,
              }}>
              ID: {item.id}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

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

  return (
    <Wrapper {...props}>
      {device?.name ? (
        <>
          <Text
            style={{
              color: 'white',
              backgroundColor: 'green',
              padding: 10,
              alignSelf: 'center',
              borderRadius: 5,
            }}>
            Connected device: {device?.name}
          </Text>
          <Pressable
            style={styles.buttonStyle}
            onPress={async () => {
              setLoading(true);
              await deviceManager
                .handleReadData('firmwareRevision')
                .then(async res => {
                  if (res) {
                    Alert.alert('firmwareRevision', res);
                    await sleep(1000);
                  }
                  setLoading(false);
                })
                .catch(err => {
                  console.error('handleReadData firmwareRevision', err);
                });
            }}>
            <Text style={styles.buttonTextStyle}>
              {'Read firmwareRevision data'}
            </Text>
          </Pressable>
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
          <Pressable
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
          </Pressable>
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
          <Text style={{marginTop: 20, fontSize: 20}}>Actions</Text>
          <Pressable
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
                  await sleep(1000);
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
          </Pressable>
          <Pressable
            style={[
              styles.buttonStyle,
              {backgroundColor: 'red', marginTop: 100},
            ]}
            onPress={() => {
              resetDevice();
              setPeripherals();
            }}>
            <Text style={styles.buttonTextStyle}>{'Unpair device'}</Text>
          </Pressable>
        </>
      ) : (
        <>
          <TouchableOpacity
            activeOpacity={0.5}
            style={[styles.buttonStyle, {marginBottom: 40}]}
            onPress={() => searchDevices()}>
            <Text style={styles.buttonTextStyle}>
              {isScanning ? 'Scanning...' : 'Scan Bluetooth Devices'}
            </Text>
          </TouchableOpacity>
          {isScanning ? (
            <ActivityIndicator size="large" />
          ) : peripherals ? (
            <>
              <Text
                style={{
                  fontSize: 20,
                  marginLeft: 10,
                  marginBottom: 5,
                  color: isDarkMode ? colors.white : colors.black,
                }}>
                Nearby Devices:
              </Text>
              <FlatList
                data={peripherals}
                contentContainerStyle={{rowGap: 12}}
                renderItem={renderItem}
                keyExtractor={item => item.id}
              />
            </>
          ) : null}
        </>
      )}
      <Text
        selectable={false}
        style={{
          alignSelf: 'center',
          color: isDarkMode ? colors.white : colors.black,
          marginTop: 20,
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
    backgroundColor: colors.green.main,
    borderWidth: 0,
    borderColor: colors.green.mid,
    height: 45,
    alignItems: 'center',
    borderRadius: 5,
    marginHorizontal: '5%',
    marginTop: 25,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
  },
});
export default SettingsScreen;
