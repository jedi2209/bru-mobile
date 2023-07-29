import BleManager from 'react-native-ble-manager';
import {
  NativeModules,
  NativeEventEmitter,
  Platform,
  PermissionsAndroid,
  Linking,
  Alert,
} from 'react-native';
import {setDevice, resetDevice} from '@store/device';
import {getFirmwareData} from '@utils/firmware';
import {get} from 'lodash';
import {NordicDFU, DFUEmitter} from 'react-native-nordic-dfu';
var Buffer = require('buffer/').Buffer; // note: the trailing slash is important!

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const isAndroid = Platform.OS === 'android';

const mainUUID = 'aae28f00-71b5-42a1-8c3c-f9cf6ac969d0';
const TX = 'aae28f01-71b5-42a1-8c3c-f9cf6ac969d0';
const RX = 'aae28f02-71b5-42a1-8c3c-f9cf6ac969d0';
const SOME = 'aae21541-71b5-42a1-8c3c-f9cf6ac969d0';
const DEFAULT_MTU = 200;

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
  }

  destructor = () => {
    for (const listener of this.listeners) {
      listener.remove();
    }
    console.info('class Device is destroyed');
  };

  _checkManager = async () => {
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
          await sleep(1000);
          return this._checkManager();
        });
    }
    console.info('BleManager already started');
    return true;
  };

  setCurrentDevice = device => {
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
    this.setCurrentDevice(null);
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

  getPeripherals = () => {
    return Array.from(this.peripherals.values());
  };

  searchBleDevices = async () => {
    await this._checkManager();
    console.log('Searching for available BLE devices...');
    return BleManager.scan(
      this.settings.SERVICE_UUIDS,
      this.settings.SECONDS_TO_SCAN_FOR,
      this.settings.ALLOW_DUPLICATES,
    )
      .then(() => {
        console.info('[searchBleDevices] promise returned successfully.');
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
    await this._checkManager();
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
          if (index >= 5) {
            return false;
          }
          if (error.indexOf('Could not find peripheral') !== -1) {
            // try to reconnect
            await sleep(500);
            return this.handleReadData(characteristicUUID, ++index);
          }
        });
    } catch (error) {
      console.error('handleReadData', error);
    }
  };

  // Send notification request
  sendNotification = async (
    serviceUUID = mainUUID,
    characteristicUUID = RX,
  ) => {
    await this._checkManager();
    await BleManager.connect(this.deviceUUID).then(async () => {
      await BleManager.retrieveServices(this.deviceUUID);
      try {
        await BleManager.startNotification(
          this.deviceUUID,
          serviceUUID,
          characteristicUUID,
        );
        console.log(
          'Notification request to ' +
            this.deviceUUID +
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
          console.log(
            'Error sendNotification from buffer:',
            buffer.toString('utf8'),
          );
        } else {
          console.log('Error sendNotification plain:', error);
        }
        return false;
      }
    });
  };

  // Listen for notifications
  listenNotifications = async (serviceUUID, characteristicUUID) => {
    await this._checkManager();
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

  removeBond = async (device = this.deviceUUID) => {
    await this._checkManager();
    await this.getBondedPeripherals().then(res => {
      if (res) {
        BleManager.removeBond(device).catch(err => {
          console.error('BleManager.removeBond error', err);
        });
      }
      this.clearDevice();
      resetDevice();
      return true;
    });
  };

  checkBondedStatus = async (device = this.deviceUUID) => {
    await this._checkManager();
    const isBonded = await this.getBondedPeripherals(device);
    if (isBonded) {
      this.setCurrentDevice(device);
      setDevice(device);
      return true;
    }
    await sleep(1500);
    return this.checkBondedStatus(device);
  };

  _getConnectedDeviceIds = async serviceUUIDs => {
    const connectedPeripherals = await BleManager.getConnectedPeripherals(
      serviceUUIDs,
    );
    return connectedPeripherals.map(peripheral => peripheral.id);
  };

  getBondedPeripherals = async (device = this.deviceUUID) => {
    await this._checkManager();
    let items = null;
    if (isAndroid) {
      items = await BleManager.getBondedPeripherals();
    } else {
      const command = sendDataCommand(0xb6);
      const isConnected = await this.writeValueAndNotify(
        Buffer(command).toJSON().data,
        mainUUID,
        RX,
        device,
      );
      if (!isConnected) {
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
    await this._checkManager();
    return await BleManager.connect(this.deviceUUID).then(async () => {
      // Success code
      return await BleManager.retrieveServices(this.deviceUUID).then(
        async () => {
          BleManager.requestMTU(this.deviceUUID, DEFAULT_MTU)
            .then(async mtu => {
              console.log('MTU size changed to ' + mtu + ' bytes', value);
              try {
                await BleManager.writeWithoutResponse(
                  this.deviceUUID,
                  serviceUUID,
                  characteristicUUID,
                  value,
                ).then(async () => {
                  console.log(
                    'writeValue => writeWithoutResponse written successfully',
                  );
                  return true;
                });
              } catch (error) {
                const buffer = Buffer.from(error); // Buffer - это https://www.npmjs.com/package/buffer
                if (buffer) {
                  console.log('Error writing value:', buffer.toString('utf8')); // ответ переводим просто в строку
                } else {
                  console.log('Error writing value:', error);
                }
                return false;
              }
            })
            .catch(error => {
              // Failure code
              console.log(error);
            });
        },
      );
    });
  };

  writeValueAndNotify = async (
    value,
    serviceUUID = mainUUID,
    characteristicUUID = RX,
    device = this.deviceUUID,
    index = 0,
  ) => {
    await this._checkManager();
    await BleManager.connect(device)
      .then(async () => {
        console.log('writeValueAndNotify ==> connected to ' + device);
        // Success code
        return await BleManager.retrieveServices(device)
          .then(async () => {
            try {
              await BleManager.write(
                device,
                serviceUUID,
                characteristicUUID,
                value,
              );
              await BleManager.retrieveServices(device).then(async res => {
                // console.log('retrieveServices', res);
                // res.characteristics.map(el => {
                //   console.log('\tservice ', el);
                // });
                return await this.sendNotification(serviceUUID, SOME);
              });
              return true;
            } catch (error) {
              let errorText = '';
              const buffer = Buffer.from(error); // Buffer - это https://www.npmjs.com/package/buffer
              if (buffer) {
                errorText = buffer.toString('utf8');
              } else {
                errorText = error;
              }
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
            console.log(error);
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
          await sleep(500);
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
    return await this.writeValueAndNotify(Buffer(command).toJSON().data).then(
      async res => {
        await sleep(5000);
        await this.searchBleDevices();
        await sleep(3000);
        const deviceID = get(this.getPeripherals(), '0.id', null);
        if (deviceID) {
          return await BleManager.connect(deviceID).then(async deviceInfo => {
            return NordicDFU.startDFU({
              deviceAddress: deviceID,
              filePath: isAndroid ? filePath : 'file://' + filePath,
            })
              .then(res => {
                // {"deviceAddress": "F8:C9:42:C4:61:D6"}
                // console.info('DFU transfer done:', res);
                DFUEmitter.removeAllListeners('DFUStateChanged');
                DFUEmitter.removeAllListeners('DFUProgress');
                return res;
              })
              .catch(err => {
                console.error('NordicDFU.startDFU error', err);
                return false;
              });
          });
        } else {
          console.error('Device not found');
        }
      },
    );
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
    console.info(response);
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
    await this._checkManager();
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

  handlePermissions = async () => {
    if (!isAndroid) {
      return true;
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
            _showPermissionAlert();
            return false;
          }
          console.info(
            '[handlePermissions] User accepts runtime permissions android 12+',
            result,
          );
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
          return true;
        } else {
          PermissionsAndroid.request(permissions).then(result => {
            if (!_checkPermissionsLocal(result)) {
              console.error(
                '[handlePermissions] User refuses runtime permission android <12',
                checkResult,
              );
              _showPermissionAlert();
              return false;
            }
            console.info(
              '[handlePermissions] User accepts runtime permission android <12',
              checkResult,
            );
            return true;
          });
        }
      });
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

export const sleep = ms => {
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
