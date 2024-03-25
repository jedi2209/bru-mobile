import {useEffect, useMemo, useState} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import {BleManager} from 'react-native-ble-plx';
import {
  $connectedDevice,
  resetDevice,
  setDevice,
} from '../core/store/connectedDevice';
import {useStore} from 'effector-react';
import base64 from 'react-native-base64';
import {DFUEmitter, NordicDFU} from 'react-native-nordic-dfu';
const Buffer = require('buffer/').Buffer;

const mainUUID = 'aae28f00-71b5-42a1-8c3c-f9cf6ac969d0';
const readUUID = 'aae28f01-71b5-42a1-8c3c-f9cf6ac969d0';
const writeUUID = 'aae28f02-71b5-42a1-8c3c-f9cf6ac969d0';

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

const isAndroid = Platform.OS === 'android';

const useBle = () => {
  const manager = useMemo(() => new BleManager(), []);

  const [allDevices, setAllDevices] = useState([]);
  const [deviceDFU, setDeviceDFU] = useState(null);
  const current = useStore($connectedDevice);

  const requestBluetoothPermission = async () => {
    if (Platform.OS === 'ios') {
      return true;
    }
    if (
      Platform.OS === 'android' &&
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    ) {
      const apiLevel = parseInt(Platform.Version.toString(), 10);

      if (apiLevel < 31) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      if (
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN &&
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
      ) {
        const result = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);

        return (
          result['android.permission.BLUETOOTH_CONNECT'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          result['android.permission.BLUETOOTH_SCAN'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          result['android.permission.ACCESS_FINE_LOCATION'] ===
            PermissionsAndroid.RESULTS.GRANTED
        );
      }
    }

    this.showErrorToast('Permission have not been granted');

    return false;
  };

  const isDuplicateDevice = (devices, nextDevice) => {
    return devices.findIndex(device => nextDevice?.id === device?.id) > -1;
  };

  const scanForPeripherals = async () => {
    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log(error);
      }
      if (device && device.name?.includes('BRU')) {
        setAllDevices(prevState => {
          if (!isDuplicateDevice(prevState, device)) {
            return [...prevState, device];
          }
          return prevState;
        });
        manager.stopDeviceScan();
        return device;
      }
    });
  };

  const connectToDevice = async device => {
    try {
      const deviceConnection = await manager.connectToDevice(device.id);
      setDevice(deviceConnection);
      await deviceConnection.discoverAllServicesAndCharacteristics();
      manager.stopDeviceScan();
    } catch (error) {
      console.log(error.reason);
    }
  };

  const disconnectFromDevice = async () => {
    try {
      const isConnected = await manager.isDeviceConnected(current.id);
      if (!isConnected) {
        await connectToDevice(current);
      }
      manager.cancelDeviceConnection(current.id);
      await resetDevice();
    } catch (error) {
      console.log(error);
    }
  };

  const writeValueWithResponse = async command => {
    try {
      const isConnected = await manager.isDeviceConnected(current.id);
      console.log(isConnected);
      if (!isConnected) {
        await connectToDevice(current);
      }
      try {
        // await connectToDevice(connectedDevice);
        const encoded = new Buffer(command).toString('base64');
        await manager.writeCharacteristicWithResponseForDevice(
          current.id,
          mainUUID,
          writeUUID,
          encoded,
        );
      } catch (error) {
        console.log(error, 'write');
      }
    } catch (error) {
      console.log(error, 'write not connected');
    }
  };

  const readValue = async characteristic => {
    try {
      const isConnected = await manager.isDeviceConnected(current.id);
      if (!isConnected) {
        await connectToDevice(current);
      }

      const data = await manager.readCharacteristicForDevice(
        current.id,
        deviceInfo[characteristic].service, // В нашем случае 180A
        deviceInfo[characteristic].characteristic, // 2A26 для firmwareRevision
      );

      return base64.decode(data.value);
    } catch (error) {
      console.log(error, 'read error');
    }
  };

  const cancelCommand = async () => {
    console.log(current.id);
    if (!current) {
      console.log('No connected device');
      return;
    }
    try {
      await connectToDevice(current);
      const command = [255, 4, 66, 129];
      const encoded = new Buffer(command).toString('base64');
      const res = await manager.writeCharacteristicWithResponseForDevice(
        current.id,
        mainUUID,
        writeUUID,
        encoded,
      );
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  const clearScans = () => {
    setAllDevices([]);
  };

  const scanDFU = () => {
    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log(error);
      }
      if (device && device.name === 'BRU_U') {
        setDeviceDFU(device);
        manager.stopDeviceScan();
        return device;
      }
    });
  };

  const connectToDFU = async device => {
    try {
      const deviceConnection = await manager.connectToDevice(device.id);
      await deviceConnection.discoverAllServicesAndCharacteristics();
      manager.stopDeviceScan();
    } catch (error) {
      console.log(error.reason);
    }
  };

  const startDFU = async fileDownloaded => {
    let connectedParams = {
      filePath: isAndroid ? fileDownloaded : 'file://' + fileDownloaded,
      alternativeAdvertisingNameEnabled: false,
      deviceAddress: deviceDFU.id,
      retries: 3,
    };
    const res = await NordicDFU.startDFU(connectedParams);
    DFUEmitter.removeAllListeners('DFUStateChanged');
    DFUEmitter.removeAllListeners('DFUProgress');
    return res;
  };

  return {
    manager,
    deviceDFU,
    allDevices,
    scanDFU,
    startDFU,
    readValue,
    clearScans,
    connectToDFU,
    cancelCommand,
    connectToDevice,
    scanForPeripherals,
    writeValueWithResponse,
    disconnectFromDevice,
    requestBluetoothPermission,
  };
};

export default useBle;
