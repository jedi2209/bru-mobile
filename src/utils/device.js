import BleManager from 'react-native-ble-manager';
import {
  NativeModules,
  NativeEventEmitter,
  Platform,
  PermissionsAndroid,
  Linking,
  Alert,
  LogBox,
} from 'react-native';
import {setDevice} from '@store/device';
var Buffer = require('buffer/').Buffer; // note: the trailing slash is important!

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const customUUID = 'aae28f00-71b5-42a1-8c3c-f9cf6ac969d0';
const TX = 'aae28f01-71b5-42a1-8c3c-f9cf6ac969d0';
const RX = 'aae28f02-71b5-42a1-8c3c-f9cf6ac969d0';

const deviceInfo = {
  // check2: {
  //   service: '1800',
  //   characteristic: '2a01',
  // },
  // check3: {
  //   service: '1800',
  //   characteristic: '2a04',
  // },
  // check4: {
  //   service: '1800',
  //   characteristic: '2aa6',
  // },
  systemID: {
    service: '180A',
    characteristic: '2A23',
  },
  modelName: {
    // service: '180A',
    // characteristic: '2A24',
    service: '1800',
    characteristic: '2a00',
  },
  serialNumber: {
    service: '180A',
    characteristic: '2A25',
  },
  firmwareRevision: {
    service: '180A',
    characteristic: '2A26',
  },
  hardwareRevision: {
    service: '180A',
    characteristic: '2A27',
  },
  softwareRevision: {
    service: '180A',
    characteristic: '2A28',
  },
  manufacturer: {
    service: '180A',
    characteristic: '2A29',
  },
};
export class Device {
  constructor({
    prefix: DEVICE_NAME_PREFIX,
    secondsToScan: SECONDS_TO_SCAN_FOR,
    allowDuplicates: ALLOW_DUPLICATES,
    device: DEVICE,
    deviceUUID: DEVICE_ID,
  }) {
    this.device = DEVICE || null;
    this.deviceUUID = DEVICE_ID || DEVICE?.id || null;
    this.serviceUUID = null;
    this.characteristicUUID = null;

    this.settings = {
      SECONDS_TO_SCAN_FOR,
      SERVICE_UUIDS: [],
      ALLOW_DUPLICATES,
      DEVICE_NAME_PREFIX,
    };

    this.peripherals = new Map();

    this.listeners = [
      bleManagerEmitter.addListener(
        'BleManagerDiscoverPeripheral',
        this._handleDiscoverPeripheral,
      ),
      // bleManagerEmitter.addListener('BleManagerStopScan', this.handleStopScan),
      bleManagerEmitter.addListener(
        'BleManagerDisconnectPeripheral',
        this._handleDisconnectedPeripheral,
      ),
      bleManagerEmitter.addListener(
        'BleManagerDidUpdateValueForCharacteristic',
        this._handleUpdateValueForCharacteristic,
      ),
    ];

    try {
      BleManager.start({showAlert: false})
        .then(() => console.debug('BleManager started.'))
        .catch(error =>
          console.error('BeManager could not be started.', error),
        );
    } catch (error) {
      console.error('unexpected error starting BleManager.', error);
      return;
    }
  }

  destructor = () => {
    for (const listener of this.listeners) {
      listener.remove();
    }
    console.info(`class Device is destroyed`);
  };

  setCurrentDevice = device => {
    this.device = device;
    if (device?.id) {
      this.setCurrentDeviceID(device.id);
    }
  };

  setCurrentDeviceID = deviceUUID => {
    this.deviceUUID = deviceUUID;
  };

  getCurrentDevice = () => {
    return this.device;
  };

  getCurrentDeviceID = () => {
    return this.deviceUUID;
  };

  getPeripherals = () => {
    return Array.from(this.peripherals.values());
  };

  searchBleDevices = async () => {
    console.log('Searching for available BLE devices...');
    return BleManager.scan(
      this.settings.SERVICE_UUIDS,
      this.settings.SECONDS_TO_SCAN_FOR,
      this.settings.ALLOW_DUPLICATES,
    )
      .then(results => {
        console.debug('[searchBleDevices] promise returned successfully.');
        // return BleManager.getDiscoveredPeripherals([]).then(
        //   discoveredDevices => {
        //     if (discoveredDevices.length === 0) {
        //       console.log('No BLE devices found.');
        //     } else {
        //       console.log(`Found ${discoveredDevices.length} BLE devices:`);
        //       discoveredDevices.forEach(device => {
        //         console.log(`- ${device.id}: ${device.name}`);
        //       });
        //     }
        //   },
        // );
      })
      .catch(error => {
        console.error('[searchBleDevices] promise returned in error', error);
      });
  };

  // Function to connect to a BLE device
  connectToDevice = async deviceUUID => {
    try {
      this._addOrUpdatePeripheral(deviceUUID, {
        ...this.device,
        connecting: true,
      });
      await BleManager.connect(deviceUUID)
        .then(async () => {
          console.info('Connected to device ' + deviceUUID);
          this._addOrUpdatePeripheral(deviceUUID, {
            ...this.device,
            connecting: false,
            connected: true,
          });
          await BleManager.retrieveServices(deviceUUID).then(res => {
            console.info('\tDiscovered services', res);
            console.info('\tDiscovered characteristics', res?.characteristics);
            res.writableServices = [];
            res.readableServices = [];
            res.notifyServices = [];

            res?.characteristics.map(el => {
              if (
                el.properties['Write'] ||
                el.properties['WriteWithoutResponse']
              ) {
                res.writableServices.push(el);
              } else if (
                el.properties['Read'] &&
                !el.properties['Write'] &&
                !el.properties['WriteWithoutResponse']
              ) {
                res.readableServices.push(el);
              } else if (el.properties['Notify']) {
                res.notifyServices.push(el);
              }
              console.log('\t\tCharacteristic ' + el?.characteristic, el);
              if (el?.descriptors) {
                console.log(
                  '\t\t\tDescriptors of ' + el?.characteristic,
                  el.descriptors,
                );
              }
            });
            this.setCurrentDevice(res);
            setDevice(res);
          });
        })
        .catch(err => {
          console.error('BleManager.connect error', err);
        });
    } catch (error) {
      console.error('Error connecting to device:', error);
    }
  };

  handleReadData = async characteristicUUID => {
    if (!deviceInfo[characteristicUUID]) {
      console.error('No such characteristic');
      return false;
    }
    try {
      this._addOrUpdatePeripheral(this.deviceUUID, {
        ...this.device,
        connecting: true,
      });
      return await BleManager.connect(this.deviceUUID)
        .then(async () => {
          this._addOrUpdatePeripheral(this.deviceUUID, {
            ...this.device,
            connecting: false,
            connected: true,
          });
          return await this._readDataFromBleDevice(
            this.deviceUUID,
            characteristicUUID,
          );
        })
        .catch(err => {
          console.error('BleManager.connect', err);
        });
    } catch (error) {
      console.error('handleReadData', error);
    }
  };

  // Send notification request
  sendNotification = async (serviceUUID, characteristicUUID, value) => {
    await BleManager.connect(this.deviceUUID).then(async () => {
      await BleManager.retrieveServices(this.deviceUUID).then(async res => {
        try {
          return await BleManager.startNotification(
            this.deviceUUID,
            serviceUUID,
            characteristicUUID,
          ).then(answer =>
            console.log(
              'Notification request to ' +
                this.deviceUUID +
                ', service ' +
                serviceUUID +
                ', characteristic ' +
                characteristicUUID +
                ' sent successfully',
              answer,
            ),
          );
        } catch (error) {
          const buffer = Buffer.from(error);
          if (buffer) {
            console.log(
              'Error sendNotification from buffer:',
              buffer.toString('utf8'),
            );
          } else {
            console.log('Error sendNotification plain:', error);
          }
        }
      });
    });
  };

  // Listen for notifications
  listenNotifications = async (serviceUUID, characteristicUUID) => {
    return BleManager.monitorCharacteristicForDevice(
      this.deviceUUID,
      serviceUUID,
      characteristicUUID,
      (error, characteristic) => {
        if (error) {
          console.log('Error receiving notification:', error);
          return;
        }

        console.log('Received notification:', characteristic.value);
      },
    );
  };

  // Function to write value and trigger notification
  writeValueAndNotify = async (serviceUUID, characteristicUUID, value) => {
    await BleManager.connect(this.deviceUUID).then(async () => {
      await BleManager.retrieveServices(this.deviceUUID).then(async res => {
        try {
          await BleManager.writeWithoutResponse(
            this.deviceUUID,
            serviceUUID,
            characteristicUUID,
            value,
          ).then(res => {
            console.log('Value written successfully', res);
          });
        } catch (error) {
          const buffer = Buffer.from(error); // Buffer - это https://www.npmjs.com/package/buffer
          if (buffer) {
            console.log('Error writing value:', buffer.toString('utf8')); // ответ переводим просто в строку
          } else {
            console.log('Error writing value:', error);
          }
        }
      });
    });
  };

  _setPeripheral = (id, updatedPeripheral) => {
    const map = new Map();
    this.peripherals = new Map(map.set(id, updatedPeripheral));
  };

  _addOrUpdatePeripheral = (id, updatedPeripheral) => {
    // new Map() enables changing the reference & refreshing UI.
    // TOFIX not efficient.
    this._setPeripheral(id, updatedPeripheral);
  };

  _handleUpdateValueForCharacteristic = data => {
    console.debug(
      `[handleUpdateValueForCharacteristic] received data from '${data.peripheral}' with characteristic='${data.characteristic}' and value='${data.value}'`,
    );
  };

  _handleDisconnectedPeripheral = event => {
    let peripheral = this.peripherals.get(event.peripheral);
    if (peripheral) {
      console.debug(
        `[handleDisconnectedPeripheral][${peripheral.id}] previously connected peripheral is disconnected.`,
        event.peripheral,
      );
      this._addOrUpdatePeripheral(peripheral.id, {
        ...peripheral,
        connected: false,
      });
    }
  };

  _handleDiscoverPeripheral = peripheral => {
    if (!peripheral.name?.includes(this.settings.DEVICE_NAME_PREFIX)) {
      return;
    }
    console.debug('[handleDiscoverPeripheral] new BLE peripheral=', peripheral);
    if (!peripheral.name) {
      peripheral.name = 'NO NAME';
    }
    this._addOrUpdatePeripheral(peripheral.id, peripheral);
  };

  _readDataFromBleDevice = async (deviceID, characteristic) => {
    return await BleManager.retrieveServices(deviceID) // запрашиваем сначала все сервисы, заодно подключаясь к устройству
      .then(async () => {
        // затем начинаем читать
        return await BleManager.read(
          deviceID, // ID of the peripheral
          deviceInfo[characteristic].service, // В нашем случае 180A
          deviceInfo[characteristic].characteristic, // 2A26 для firmwareRevision
        )
          .then(data => {
            const buffer = Buffer.from(data); // Buffer - это https://www.npmjs.com/package/buffer
            if (buffer) {
              return buffer.toString('utf8'); // ответ переводим просто в строку
            }
            return false;
          })
          .catch(err => {
            console.error('BleManager.read', err);
            return false;
          });
      })
      .catch(err => {
        console.error('BleManager.retrieveServices', err);
      });
  };

  handleAndroidPermissions = async () => {
    console.info(
      'Platform.OS, Platform.Version',
      Platform.OS,
      Platform.Version,
    );
    if (Platform.OS === 'android' && Platform.Version >= 31) {
      const permissions = [
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ];
      return await PermissionsAndroid.requestMultiple(permissions).then(
        result => {
          if (!_checkPermissionsLocal(result)) {
            console.error(
              '[handleAndroidPermissions] User refuses runtime permissions android 12+',
              result,
            );
            _showPermissionAlert();
            return false;
          }
          console.info(
            '[handleAndroidPermissions] User accepts runtime permissions android 12+',
            result,
          );
          return true;
        },
      );
    } else if (Platform.OS === 'android' && Platform.Version >= 23) {
      const permissions = PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION;
      return await PermissionsAndroid.check(permissions).then(checkResult => {
        if (checkResult) {
          console.info(
            '[handleAndroidPermissions] runtime permission Android <12 already OK',
            checkResult,
          );
          return true;
        } else {
          PermissionsAndroid.request(permissions).then(result => {
            if (!_checkPermissionsLocal(result)) {
              console.error(
                '[handleAndroidPermissions] User refuses runtime permission android <12',
                checkResult,
              );
              _showPermissionAlert();
              return false;
            }
            console.info(
              '[handleAndroidPermissions] User accepts runtime permission android <12',
              checkResult,
            );
            return true;
          });
        }
      });
    } else if (Platform.OS === 'ios') {
      return true;
    }
  };
}

const _checkPermissionsLocal = result => {
  if (
    (result['android.permission.BLUETOOTH_SCAN'] &&
      result['android.permission.BLUETOOTH_SCAN'] !== 'granted') ||
    (result['android.permission.BLUETOOTH_CONNECT'] &&
      result['android.permission.BLUETOOTH_CONNECT'] !== 'granted') ||
    (result['android.permission.ACCESS_FINE_LOCATION'] &&
      result['android.permission.ACCESS_FINE_LOCATION'] !== 'granted')
  ) {
    return false;
  }
  return true;
};

const _showPermissionAlert = () => {
  Alert.alert(
    'Error',
    'Please enable location and bluetooth permissions to be able to find BRU machine',
    [
      {
        text: 'Open Settings',
        onPress: () => Linking.openSettings(),
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ],
    {
      cancelable: false,
      onDismiss: () => {
        return false;
      },
    },
  );
};

// const retrieveConnected = async () => {
//   try {
//     const connectedPeripherals = await BleManager.getConnectedPeripherals();
//     if (connectedPeripherals.length === 0) {
//       console.warn('[retrieveConnected] No connected peripherals found.');
//       return;
//     }

//     console.debug(
//       '[retrieveConnected] connectedPeripherals',
//       connectedPeripherals,
//     );

//     for (var i = 0; i < connectedPeripherals.length; i++) {
//       var peripheral = connectedPeripherals[i];
//       addOrUpdatePeripheral(peripheral.id, {...peripheral, connected: true});
//     }
//   } catch (error) {
//     console.error(
//       '[retrieveConnected] unable to retrieve connected peripherals.',
//       error,
//     );
//   }
// };

// const handeStartScan = () => {
//   if (isScanning) {
//     return;
//   }
//   // reset found peripherals before scan
//   setPeripherals(new Map());

//   try {
//     setIsScanning(true);
//     BleManager.scan(SERVICE_UUIDS, SECONDS_TO_SCAN_FOR, ALLOW_DUPLICATES)
//       .then(() => {
//         console.debug('[startScan] scan promise returned successfully.');
//       })
//       .catch(err => {
//         console.error('[startScan] ble scan returned in error', err);
//       });
//   } catch (error) {
//     console.error('[startScan] ble scan error thrown', error);
//   }
// };

// const handleStopScan = () => {
//   setIsScanning(false);
//   console.debug('[handleStopScan] scan is stopped.');
// };

// const handleDiscoverPeripheral = peripheral => {
//   if (!peripheral.name?.includes(DEVICE_NAME_PREFIX)) {
//     return;
//   }
//   console.debug('[handleDiscoverPeripheral] new BLE peripheral=', peripheral);
//   if (!peripheral.name) {
//     peripheral.name = 'NO NAME';
//   }
//   addOrUpdatePeripheral(peripheral.id, peripheral);
// };

// const connectPeripheral = async peripheral => {
//   try {
//     if (peripheral) {
//       addOrUpdatePeripheral(peripheral.id, {...peripheral, connecting: true});

//       await BleManager.connect(peripheral.id);
//       console.debug(`[connectPeripheral][${peripheral.id}] connected.`);

//       addOrUpdatePeripheral(peripheral.id, {
//         ...peripheral,
//         connecting: false,
//         connected: true,
//       });

//       // before retrieving services, it is often a good idea to let bonding & connection finish properly
//       await sleep(900);

//       /* Test read current RSSI value, retrieve services first */
//       const peripheralData = await BleManager.retrieveServices(peripheral.id);
//       console.debug(
//         `[connectPeripheral][${peripheral.id}] retrieved peripheral services`,
//         peripheralData,
//       );
//       peripheralData.characteristics.map(el => {
//         console.log('characteristics', el);
//       });
//       setDevice(peripheralData);

//       const rssi = await BleManager.readRSSI(peripheral.id);
//       console.debug(
//         `[connectPeripheral][${peripheral.id}] retrieved current RSSI value: ${rssi}.`,
//       );

//       if (peripheralData.characteristics) {
//         for (let characteristic of peripheralData.characteristics) {
//           if (characteristic.descriptors) {
//             for (let descriptor of characteristic.descriptors) {
//               try {
//                 let data = await BleManager.readDescriptor(
//                   peripheral.id,
//                   characteristic.service,
//                   characteristic.characteristic,
//                   descriptor.uuid,
//                 );
//                 console.debug(
//                   `[connectPeripheral][${peripheral.id}] descriptor read as:`,
//                   data,
//                 );
//               } catch (error) {
//                 console.error(
//                   `[connectPeripheral][${peripheral.id}] failed to retrieve descriptor ${descriptor} for characteristic ${characteristic}:`,
//                   error,
//                 );
//               }
//             }
//           }
//         }
//       }

//       let p = peripherals.get(peripheral.id);
//       if (p) {
//         addOrUpdatePeripheral(peripheral.id, {...peripheral, rssi});
//       }
//     }
//   } catch (error) {
//     console.error(
//       `[connectPeripheral][${peripheral.id}] connectPeripheral error`,
//       error,
//     );
//   }
// };

// const togglePeripheralConnection = async peripheral => {
//   if (peripheral && peripheral.connected) {
//     try {
//       await BleManager.disconnect(peripheral.id);
//     } catch (error) {
//       console.error(
//         `[togglePeripheralConnection][${peripheral.id}] error when trying to disconnect device.`,
//         error,
//       );
//     }
//   } else {
//     await connectPeripheral(peripheral);
//   }
// };
