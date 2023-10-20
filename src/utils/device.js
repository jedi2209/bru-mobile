import BleManager from 'react-native-ble-manager';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import {
  NativeModules,
  NativeEventEmitter,
  Platform,
  PermissionsAndroid,
  Linking,
  Alert,
} from 'react-native';
import {setDevice} from '@store/device';
import {getFirmwareData} from '@utils/firmware';
import {check, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {get} from 'lodash';
import {NordicDFU, DFUEmitter} from 'react-native-nordic-dfu';
import {DEVICE_MANAGER_CONFIG} from '@const';
const Buffer = require('buffer/').Buffer; // note: the trailing slash is important!

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const isAndroid = Platform.OS === 'android';

const mainUUID = 'aae28f00-71b5-42a1-8c3c-f9cf6ac969d0';
const TX = 'aae28f01-71b5-42a1-8c3c-f9cf6ac969d0';
const RX = 'aae28f02-71b5-42a1-8c3c-f9cf6ac969d0';
const SOME = 'aae21541-71b5-42a1-8c3c-f9cf6ac969d0';
const DEFAULT_MTU = 100;

const defaultTimeout = 1000;
const maxAttemps = 10;

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
  OTAMode: 0x27,
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
    this.bleStarted = false;
    this.bluetoothState = false;
    this.permissionGranted = false;

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
      bleManagerEmitter.addListener(
        'BleManagerDidUpdateNotificationStateFor',
        this._handleUpdateNotificationStateFor,
      ),

      bleManagerEmitter.addListener(
        'BleManagerDidUpdateState',
        this._handleUpdateState,
      ),
    ];
  }

  destructor = () => {
    for (const listener of this.listeners) {
      listener.remove();
    }
    console.info('class Device is destroyed');
  };

  _checkManager = async () => {
    const bluetoothState = await this.handleBluetoothState();
    switch (bluetoothState) {
      case 'Unsupported':
        return false;
      case 'PoweredOff':
        _showBluetoothAlert();
        return false;
      case 'Unauthorized':
        _showPermissionAlert();
        return false;
      case 'PoweredOn':
        break;
    }
    if (!this.bleStarted) {
      BleManager.start({showAlert: true})
        .then(() => {
          console.info('BleManager started.');
          this.bleStarted = true;
          return true;
        })
        .catch(async error => {
          console.error('BeManager could not be started.', error);
          this.bleStarted = false;
          await sleep();
          return this._checkManager();
        });
    }
    await sleep();
    const permissionGranted = await this.handlePermissions();
    if (!permissionGranted) {
      _showPermissionAlert();
      return false;
    }
    return true;
  };

  setCurrentDevice = (device = null) => {
    this.device = device;
    if (device?.id) {
      this.setCurrentDeviceID(device.id);
    }
    if (device?.name) {
      this.setCurrentDeviceName(device.name);
    }
  };

  setCurrentDeviceID = deviceUUID => {
    this.deviceUUID = deviceUUID;
  };

  setCurrentDeviceName = deviceName => {
    this.deviceName = deviceName;
  };

  clearDevice = () => {
    this.setCurrentDevice();
  };

  getCurrentDevice = () => {
    return this.device;
  };

  getCurrentDeviceID = () => {
    return this.deviceUUID;
  };

  getCurrentDeviceName = () => {
    return this.deviceName;
  };

  getPeripherals = (itemID = null) => {
    if (itemID) {
      return this.peripherals.get(itemID);
    }
    return Array.from(this.peripherals.values());
  };

  clearPeripherals = () => {
    this.peripherals = new Map();
    return this.peripherals;
  };

  searchBleDevices = async () => {
    const preCheck = await this._checkManager();
    if (!preCheck) {
      console.error('searchBleDevices preCheck', preCheck);
      return false;
    }
    console.info(
      '=========== searchBleDevices BleManager.scan params ===========',
      this.settings.SERVICE_UUIDS + ' UUIDS, ',
      this.settings.SECONDS_TO_SCAN_FOR + ' seconds, ',
      this.settings.ALLOW_DUPLICATES + ' allow duplicates',
    );
    return BleManager.scan(
      this.settings.SERVICE_UUIDS,
      this.settings.SECONDS_TO_SCAN_FOR,
      this.settings.ALLOW_DUPLICATES,
    )
      .then(() => {
        console.info('BleManager.scan successfully');
        return true;
      })
      .catch(error => {
        console.error('[searchBleDevices] promise returned in error', error);
        return false;
      });
  };

  // Function to connect to a BLE device
  connectToDevice = async deviceUUID => {
    const preCheck = await this._checkManager();
    if (!preCheck) {
      return false;
    }
    try {
      this._addOrUpdatePeripheral(deviceUUID, {
        ...this.device,
        connecting: true,
      });
      return await BleManager.connect(deviceUUID)
        .then(async () => {
          console.info('Connected to device ' + deviceUUID);
          this._addOrUpdatePeripheral(deviceUUID, {
            ...this.device,
            connecting: false,
            connected: true,
          });
          return await BleManager.retrieveServices(deviceUUID).then(res => {
            // console.info('\tDiscovered services', res);
            // console.info('\tDiscovered characteristics', res?.characteristics);
            res.writableServices = [];
            res.readableServices = [];
            res.notifyServices = [];

            get(res, 'characteristics', []).map(el => {
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
              // console.info('\t\tCharacteristic ' + el?.characteristic, el);
              if (el?.descriptors) {
                // console.info(
                //   '\t\t\tDescriptors of ' + el?.characteristic,
                //   el.descriptors,
                // );
              }
            });
            return res;
          });
        })
        .catch(err => {
          console.error('BleManager.connect error', err);
          return false;
        });
    } catch (error) {
      console.error('Error connecting to device:', error);
      return false;
    }
  };

  handleReadData = async (characteristicUUID, index = 0) => {
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
        .catch(async error => {
          console.error('BleManager.connect', error, index);
          if (index >= maxAttemps) {
            return false;
          }
          if (error.indexOf('Could not find peripheral') !== -1) {
            // try to reconnect
            await sleep();
            return this.handleReadData(characteristicUUID, ++index);
          }
        });
    } catch (error) {
      console.error('handleReadData', error);
    }
  };

  // Send notification request
  sendNotification = async (
    deviceUUID = this.deviceUUID,
    serviceUUID = mainUUID,
    characteristicUUID = RX,
  ) => {
    const preCheck = await this._checkManager();
    if (!preCheck) {
      return false;
    }
    return BleManager.connect(deviceUUID).then(async () => {
      await BleManager.retrieveServices(deviceUUID);
      try {
        await BleManager.startNotification(
          deviceUUID,
          serviceUUID,
          characteristicUUID,
        );
        console.info(
          'Notification request to ' +
            deviceUUID +
            ', service ' +
            serviceUUID +
            ', characteristic ' +
            characteristicUUID +
            ' sent successfully',
        );
        return true;
      } catch (error) {
        const buffer = Buffer.from(error);
        if (buffer) {
          console.info(
            'Error sendNotification from buffer:',
            buffer.toString('utf8'),
          );
        } else {
          console.info('Error sendNotification plain:', error);
        }
        return false;
      }
    });
  };

  // Listen for notifications
  listenNotifications = async (serviceUUID, characteristicUUID) => {
    const preCheck = await this._checkManager();
    if (!preCheck) {
      return false;
    }
    return BleManager.monitorCharacteristicForDevice(
      this.deviceUUID,
      serviceUUID,
      characteristicUUID,
      (error, characteristic) => {
        if (error) {
          console.error('Error receiving notification:', error);
          return;
        }

        console.info('Received notification:', characteristic.value);
      },
    );
  };

  removeBond = async (device = this.deviceUUID) => {
    const preCheck = await this._checkManager();
    console.info(
      'removeBond => await this._checkManager() success - value: ',
      preCheck,
    );
    if (!preCheck) {
      return false;
    }
    console.info('removeBond => this.getBondedPeripherals() start');
    const res = await this.getBondedPeripherals();
    console.info(
      'removeBond => this.getBondedPeripherals() finish - value: ',
      res,
    );
    if (res && isAndroid) {
      BleManager.removeBond(device).catch(err => {
        console.error('BleManager.removeBond error', err);
      });
      // console.info('removeBond await this.getBondedPeripherals => res + isAndroid', res, isAndroid);
    }
    this.device.isCurrent = false;
    console.info('removeBond => setDevice start - device: ', this.device);
    setDevice(this.device);
    console.info('removeBond => setDevice finish, this.clearDevice start');
    this.clearDevice();
    console.info('removeBond => this.clearDevice finish');
    return true;
  };

  checkBondedStatus = async (
    device = this.deviceUUID,
    index = 0,
    maxAttempsLocal = maxAttemps,
  ) => {
    if (index >= maxAttempsLocal) {
      return false;
    }
    const preCheck = await this._checkManager();
    if (!preCheck) {
      return false;
    }
    const isBonded = await this.getBondedPeripherals(device);
    if (isBonded) {
      this.setCurrentDevice(device);
      // setDevice(device);
      return true;
    }
    return this.checkBondedStatus(device, ++index, maxAttempsLocal);
  };

  _getConnectedDeviceIds = async serviceUUIDs => {
    const connectedPeripherals = await BleManager.getConnectedPeripherals(
      serviceUUIDs,
    );
    return connectedPeripherals.map(peripheral => peripheral.id);
  };

  getBondedPeripherals = async (device = this.deviceUUID) => {
    const preCheck = await this._checkManager();
    if (!preCheck) {
      return false;
    }
    let items = null;
    if (isAndroid) {
      items = await BleManager.getBondedPeripherals();
    } else {
      const command = sendDataCommand(0xb4);
      const isConnected = await this.writeValueAndNotify(
        Buffer(command).toJSON().data,
        mainUUID,
        RX,
        device,
      );
      if (!isConnected) {
        console.error('getBondedPeripherals isConnected', isConnected);
        return false;
      }
      items = [{id: device}];
    }
    const data = items.map(el => {
      if (el.id === device) {
        return true;
      }
      return null;
    });
    const res = data.filter(el => el !== null);
    return res.length > 0;
  };

  // Function to write value and trigger notification
  writeValue = async (
    value,
    serviceUUID = mainUUID,
    characteristicUUID = RX,
  ) => {
    const preCheck = await this._checkManager();
    if (!preCheck) {
      return false;
    }
    return await BleManager.connect(this.deviceUUID).then(async () => {
      // Success code
      return await BleManager.retrieveServices(this.deviceUUID)
        .then(async () => {
          try {
            await BleManager.writeWithoutResponse(
              this.deviceUUID,
              serviceUUID,
              characteristicUUID,
              value,
            ).then(async () => {
              console.info(
                'writeValue => writeWithoutResponse written successfully',
              );
              return true;
            });
          } catch (error) {
            const bufferError = Buffer.from(error); // Buffer - это https://www.npmjs.com/package/buffer
            if (bufferError) {
              console.error(
                'Error writing value:',
                bufferError.toString('utf8'),
              ); // ответ переводим просто в строку
            } else {
              console.info('Error writing value:', error);
            }
            return false;
          }
        })
        .catch(error => {
          // Failure code
          console.error('writeValue => BleManager.retrieveServices', error);
        });
    });
  };

  writeValueAndNotify = async (
    value,
    serviceUUID = mainUUID,
    characteristicUUID = RX,
    device = this.deviceUUID,
    index = 0,
  ) => {
    const preCheck = await this._checkManager();
    if (!preCheck) {
      console.error('writeValueAndNotify preCheck', preCheck);
      return false;
    }
    console.info('writeValueAndNotify preCheck', preCheck);
    return BleManager.connect(device)
      .then(async connectRes => {
        console.info('writeValueAndNotify => BleManager.connect', connectRes);
        // Success code
        return BleManager.retrieveServices(device)
          .then(async () => {
            // console.log(
            //   'writeValueAndNotify => BleManager.connect => BleManager.retrieveServices.then',
            // );
            try {
              await BleManager.write(
                device,
                serviceUUID,
                characteristicUUID,
                value,
              );
              const services = await BleManager.retrieveServices(device);
              if (services) {
                const notificationStatus = await this.sendNotification(
                  device,
                  serviceUUID,
                  SOME,
                );
              }
              // console.log('retrieveServices', res);
              // res.characteristics.map(el => {
              //   console.log('\tservice ', el);
              // });
              return true;
            } catch (error) {
              let errorText = '';
              const buffer = Buffer.from(error); // Buffer - это https://www.npmjs.com/package/buffer
              if (buffer) {
                errorText = buffer.toString('utf8');
              } else {
                errorText = error;
              }
              console.error(
                'writeValueAndNotify => BleManager.connect => BleManager.retrieveServices.cacth',
                errorText,
              );
              switch (errorText) {
                case 'Encryption is insufficient.': // iOS not paired
                  return false;
                case 'Wrong UUID format (null)': // iOS is paired
                  return true;
              }
            }
          })
          .catch(error => {
            // Failure code
            console.error(
              'writeValueAndNotify => BleManager.connect => BleManager.retrieveServices.catch',
              error,
            );
          });
      })
      .catch(async error => {
        console.error(
          'writeValueAndNotify => BleManager.connect failed',
          error,
        );
        if (index >= 3) {
          return false;
        }
        if (error.indexOf('Could not find peripheral') !== -1) {
          // try to reconnect
          await sleep(5 * defaultTimeout);
          return this.writeValueAndNotify(
            device,
            serviceUUID,
            characteristicUUID,
            value,
            ++index,
          );
        }
      });
  };

  startDFU = async filePath => {
    const command = sendDataCommand(deviceInfo.OTAMode);
    const sendToReboot = await this.repeatFunc(
      'writeValue',
      Buffer(command).toJSON().data,
      2,
    );
    console.info('\t\t\tsendToReboot', sendToReboot);
    await sleep(5 * defaultTimeout);
    const devices = await this.repeatFunc('searchBleDevices', 2);
    if (devices) {
      const deviceID = get(this.getPeripherals(), '0.id', null);
      if (deviceID) {
        let connectedParams = {
          filePath: isAndroid ? filePath : 'file://' + filePath,
          alternativeAdvertisingNameEnabled: false,
          deviceAddress: deviceID,
          retries: 3,
        };
        console.info(
          'Connected!\r\n\tBleManager.connect finish => device: ',
          deviceID,
        );
        try {
          const res = await NordicDFU.startDFU(connectedParams);
          console.info('DFU transfer done:', res);
          DFUEmitter.removeAllListeners('DFUStateChanged');
          DFUEmitter.removeAllListeners('DFUProgress');
          return res;
        } catch (err) {
          console.error(
            'startDFU => NordicDFU.startDFU error',
            err,
            connectedParams,
          );
          return false;
        }
        // return BleManager.connect(deviceID)
        //   .then(async () => {
        //     let connectedParams = {
        //       filePath: isAndroid ? filePath : 'file://' + filePath,
        //       alternativeAdvertisingNameEnabled: false,
        //       deviceAddress: deviceID,
        //       retries: 3,
        //     };
        //     // if (deviceName) {
        //     //   connectedParams.deviceName = deviceName;
        //     // }
        //     console.info(
        //       'Connected!\r\n\tBleManager.connect finish => device: ',
        //       deviceID,
        //     );
        //     try {
        //       const res = await NordicDFU.startDFU(connectedParams);
        //       console.info('DFU transfer done:', res);
        //       DFUEmitter.removeAllListeners('DFUStateChanged');
        //       DFUEmitter.removeAllListeners('DFUProgress');
        //       return res;
        //     } catch (err) {
        //       console.error(
        //         'startDFU => NordicDFU.startDFU error',
        //         err,
        //         connectedParams,
        //       );
        //       return false;
        //     }
        //   })
        //   .catch(err => {
        //     console.error('\tBleManager.connect(deviceID)', deviceID);
        //   });
      } else {
        console.error('startDFU => Device not found');
        return false;
      }
    } else {
      return false;
    }
  };

  checkUpdateFirmware = () => {
    return;
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
    const response = Buffer.from(data.value).toString('utf8');
    console.info('[_handleUpdateValueForCharacteristic]', response);
  };

  _handleUpdateNotificationStateFor = data => {
    console.log('[_handleUpdateNotificationStateFor]', data);
  };

  _handleUpdateState = state => {
    if (get(state, 'state') === 'unauthorized') {
      this.permissionGranted = false;
    } else {
      this.permissionGranted = true;
    }
    console.log('[_handleUpdateState]', state);
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
    // console.debug('[handleDiscoverPeripheral] new BLE peripheral=', peripheral);
    if (!peripheral.name) {
      peripheral.name = 'NO NAME';
    }
    this._addOrUpdatePeripheral(peripheral.id, peripheral);
  };

  _readDataFromBleDevice = async (deviceID, characteristic) => {
    const preCheck = await this._checkManager();
    if (!preCheck) {
      return false;
    }
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

  handleBluetoothState = async () => {
    const bluetoothState = await BluetoothStateManager.getState();
    this.bluetoothState = false;
    if (bluetoothState === 'PoweredOn') {
      this.bluetoothState = true;
    }
    return bluetoothState;
  };

  handlePermissions = async () => {
    if (!isAndroid) {
      const result = await check(PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL);
      switch (result) {
        case RESULTS.UNAVAILABLE:
        case RESULTS.DENIED:
        case RESULTS.BLOCKED:
          this.permissionGranted = false;
          break;
        case RESULTS.LIMITED:
        case RESULTS.GRANTED:
          this.permissionGranted = true;
          break;
      }
      return this.permissionGranted;
    }
    if (Platform.Version >= 31) {
      const permissions = [
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ];
      return await PermissionsAndroid.requestMultiple(permissions).then(
        result => {
          if (!_checkPermissionsLocal(result)) {
            console.error(
              '[handlePermissions] User refuses runtime permissions android 12+',
              result,
            );
            this.permissionGranted = false;
            _showPermissionAlert();
            return false;
          }
          // console.info(
          //   '[handlePermissions] User accepts runtime permissions android 12+',
          //   result,
          // );
          this.permissionGranted = true;
          return true;
        },
      );
    } else if (Platform.Version >= 23) {
      const permissions = PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION;
      return await PermissionsAndroid.check(permissions).then(checkResult => {
        if (checkResult) {
          console.info(
            '[handlePermissions] runtime permission Android <12 already OK',
            checkResult,
          );
          this.permissionGranted = true;
          return true;
        } else {
          PermissionsAndroid.request(permissions).then(result => {
            if (!_checkPermissionsLocal(result)) {
              console.error(
                '[handlePermissions] User refuses runtime permission android <12',
                checkResult,
              );
              _showPermissionAlert();
              this.permissionGranted = false;
              return false;
            }
            console.info(
              '[handlePermissions] User accepts runtime permission android <12',
              checkResult,
            );
            this.permissionGranted = true;
            return true;
          });
        }
      });
    }
  };

  repeatFunc = async (func, params = null, times = 3, delay = 500) => {
    return new Promise((resolve, reject) => {
      let i = 0;
      const interval = setInterval(async () => {
        try {
          const res = await this[func](params);
          i++;
          console.info('repeatFunc => ' + func, res, i, times);
          if (i === times) {
            clearInterval(interval);
            resolve(res);
          }
        } catch (error) {
          clearInterval(interval);
          console.error('repeatFunc => ' + func, error);
          reject(error);
        }
      }, delay);
    });
  };
}
// Device class

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
    'Bluetooth and Local Network access required',
    '\r\nPlease enable Local Network and Bluetooth permissions to be able to find and communicate with BRU machine',
    [
      {
        text: 'Open Settings',
        isPreferred: true,
        style: 'default',
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

const _showBluetoothAlert = () => {
  Alert.alert(
    'Bluetooth must be enabled',
    '\r\nPlease enable Bluetooth to be able to find and communicate with BRU machine',
    [
      {
        text: 'OK',
        isPreferred: true,
        style: 'default',
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

export const sendDataCommand = (cmd, data = 0, len = 0) => {
  let sendBufferPlus = new Int8Array(4);
  if (data) {
    sendBufferPlus = new Uint8Array(5);
  }
  sendBufferPlus[0] = 0xff;
  sendBufferPlus[1] = 4;
  sendBufferPlus[2] = cmd;

  if (data !== null) {
    for (let i = 0; i < len; i++) {
      sendBufferPlus[3 + i] = data[i];
    }
    sendBufferPlus[1] += len;
  }

  len = sendBufferPlus[1] - 1;
  sendBufferPlus[len] = _calcChecksum(sendBufferPlus, len);
  return sendBufferPlus;
};

const _calcChecksum = (dat, len) => {
  let chksum = 0;
  for (let i = 0; i < len; i++) {
    chksum += dat[i];
  }
  chksum = 0 - chksum;
  chksum ^= 0x3a;
  return chksum;
};

export const sleep = (ms = defaultTimeout) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const bufferToHex = buffer => {
  var s = '',
    h = '0123456789ABCDEF';
  new Uint8Array(buffer).forEach(v => {
    s += h[v >> 4] + h[v & 15];
  });
  return s;
};

export const deviceManager = new Device(DEVICE_MANAGER_CONFIG);
