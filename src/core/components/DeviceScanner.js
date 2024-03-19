import React, {useState, useEffect} from 'react';
import {Text, View, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import {Button} from '@gluestack-ui/themed';
import LottieView from 'lottie-react-native';

import {deviceManager, sleep} from '@utils/device';

import {get} from 'lodash';
import {colors} from '@styleConst';
import {useStore} from 'effector-react';
import {$themeStore} from '../store/theme';

const DeviceScanner = props => {
  const {onItemPress, autoScan} = props;
  const [isScanning, setIsScanning] = useState(autoScan);
  const [peripherals, setPeripherals] = useState(null);
  const theme = useStore($themeStore);
  const isDarkMode = theme === 'dark';

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
      console.info('searchDevices devices', devices);
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
        <View style={[styles.itemContainer, {backgroundColor: color}]}>
          <Text
            style={[
              styles.itemName,
              {
                color: isDarkMode ? colors.white : colors.black,
              },
            ]}>
            {item.name}
            {item.connecting && ' - Connecting...'}
          </Text>
          <View
            style={[
              styles.itemIdWrapper,
              {
                backgroundColor: color,
              },
            ]}>
            <Text
              style={[
                styles.itemIdText,
                {
                  color: isDarkMode ? colors.white : colors.black,
                },
              ]}>
              ID: {item.id}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (isScanning) {
    return (
      <LottieView
        source={require('@assets/lottie/Animation-1697316689983.lottie')}
        height={270}
        autoPlay
        loop
      />
    );
  }

  if (get(peripherals, 'length') === 1) {
    return onItemPress(get(peripherals, '0'));
  }

  return (
    <>
      {get(peripherals, 'length') ? (
        <View style={styles.nearbydDevicesContainer}>
          <Text
            style={[
              styles.nearbydDevicesText,
              {
                color: isDarkMode ? colors.white : colors.black,
              },
            ]}>
            Nearby devices:
          </Text>
          {peripherals.map(item => {
            return renderItem(item);
          })}
        </View>
      ) : null}
      {!isScanning ? (
        <Button size="lg" variant={'primary'} onPress={() => searchDevices()}>
          <Text style={styles.buttonTextStyle}>Scan</Text>
        </Button>
      ) : null}
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
  nearbydDevicesText: {
    fontSize: 16,
    marginLeft: 10,
    marginVertical: 5,
    marginBottom: 20,
  },
  nearbydDevicesContainer: {marginBottom: 24},
  itemContainer: {
    borderRadius: 5,
    paddingVertical: 5,
    marginHorizontal: 10,
    paddingHorizontal: 10,
  },
  itemName: {fontSize: 18, textTransform: 'capitalize'},
  itemIdWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemIdText: {fontSize: 14},
});

DeviceScanner.defaultProps = {
  onItemPress: () => {},
  autoScan: false,
};

export default DeviceScanner;
