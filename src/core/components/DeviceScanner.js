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
import {Button} from '@gluestack-ui/themed';
import {useStore} from 'effector-react';
import {ActivityIndicator} from 'react-native-paper';
import DeviceInfo from 'react-native-device-info';

import {$deviceSettingsStore, setDevice, resetDevice} from '@store/device';
import {$langSettingsStore} from '@store/lang';

import Wrapper from '@comp/Wrapper';

import {Device, sendDataCommand, sleep} from '@utils/device';

import {get} from 'lodash';
import {colors} from '@styleConst';
import {convertStyledToStyledVerbosed} from '@dank-style/react';

const SECONDS_TO_SCAN_FOR = 5;
const DEVICE_NAME_PREFIX = 'BRU';
const Buffer = require('buffer/').Buffer; // note: the trailing slash is important!

const deviceManager = new Device({
  prefix: DEVICE_NAME_PREFIX,
  secondsToScan: SECONDS_TO_SCAN_FOR,
  allowDuplicates: false,
});

const DeviceScanner = props => {
  const {onItemPress, autoScan} = props;
  const [isScanning, setIsScanning] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [peripherals, setPeripherals] = useState(null);

  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    autoScan ? searchDevices() : null;
  }, [autoScan]);

  const searchDevices = async () => {
    const permissionGranted = await deviceManager._checkManager();
    deviceManager.setCurrentDevice(null);
    // resetDevice();
    setIsScanning(true);
    if (permissionGranted) {
      deviceManager.clearPeripherals();
      const devices = await deviceManager.repeatFunc('searchBleDevices');
      if (devices) {
        return sleep(3500).then(() => {
          const peripheralsTmp = deviceManager.getPeripherals();
          if (!peripheralsTmp || peripheralsTmp.length === 0) {
            Alert.alert(
              'No devices found 🤷‍♂️',
              'Please try again.\r\n\r\nMake sure that you turn on Bluetooth on BRU device.\r\n\r\nTo do it just navigate to 🛠️Machine Setup => Bluetooth',
            );
          } else {
            setPeripherals(peripheralsTmp);
          }
          setIsScanning(false);
        });
      }
    } else {
      setIsScanning(false);
    }
  };

  const renderItem = item => {
    const color = item?.connected
      ? colors.green.mid
      : isDarkMode
      ? colors.brown
      : colors.gray.inactive;
    return (
      <TouchableOpacity key={'bru' + item.id} onPress={() => onItemPress(item)}>
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
            {/* <Text
              style={{
                fontSize: 14,
                color: isDarkMode ? colors.white : colors.black,
              }}>
              RSSI: {item.rssi}
            </Text> */}
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

  if (isLoading || isScanning) {
    return (
      <ActivityIndicator
        size="large"
        color={colors.green.mid}
        style={{marginTop: '20%'}}
      />
    );
  }

  if (get(peripherals, 'length') === 1) {
    return onItemPress(get(peripherals, '0'));
  }

  return (
    <>
      {get(peripherals, 'length') ? (
        <View style={{marginBottom: 24}}>
          <Text
            style={{
              fontSize: 16,
              marginLeft: 10,
              marginVertical: 5,
              marginBottom: 20,
              color: isDarkMode ? colors.white : colors.black,
            }}>
            Nearby devices:
          </Text>
          {peripherals.map(item => {
            return renderItem(item);
          })}
        </View>
      ) : null}
      <Button size="lg" variant={'primary'} onPress={() => searchDevices()}>
        <Text style={styles.buttonTextStyle}>Scan</Text>
      </Button>
    </>
  );
};

const styles = StyleSheet.create({
  buttonStyle: {
    height: 55,
    alignItems: 'center',
    borderRadius: 20,
    marginHorizontal: '15%',
    marginTop: 25,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
    textTransform: 'uppercase',
  },
});

DeviceScanner.defaultProps = {
  onItemPress: () => {},
  autoScan: false,
};

export default DeviceScanner;
