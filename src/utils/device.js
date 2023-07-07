import BleManager from 'react-native-ble-manager';
var Buffer = require('buffer/').Buffer; // note: the trailing slash is important!

const deviceInfo = {
  systemID: {
    service: '180A',
    characteristic: '2A23',
  },
  modelName: {
    service: '180A',
    characteristic: '2A24',
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

const readData = async (deviceID, characteristic) => {
  return await BleManager.retrieveServices(deviceID)
    .then(async () => {
      return await BleManager.read(
        deviceID,
        deviceInfo[characteristic].service,
        deviceInfo[characteristic].characteristic,
      )
        .then(data => {
          const buffer = Buffer.from(data);
          if (buffer) {
            return buffer.toString('utf8');
          }
          return false;
        })
        .catch(err => {
          console.error('BleManager.read', err);
        });
    })
    .catch(err => {
      console.error('BleManager.retrieveServices', err);
    });
};

export const handleReadData = async (deviceID, characteristic) => {
  if (!deviceInfo[characteristic]) {
    console.error('No such characteristic');
    return false;
  }
  try {
    return await BleManager.connect(deviceID)
      .then(async () => {
        return await readData(deviceID, characteristic);
      })
      .catch(err => {
        console.error('BleManager.connect', err);
      });
  } catch (error) {
    console.error(error);
  }
};
