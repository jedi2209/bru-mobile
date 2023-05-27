import {Platform} from 'react-native';
import {
  getUniqueId,
  getIpAddress,
  getCarrier,
  getBrand,
  getBuildId,
  getDeviceId,
  getFirstInstallTime,
  getModel,
  getVersion,
  getBuildNumber,
  getReadableVersion,
  getUserAgent,
} from 'react-native-device-info';
import {firebase} from '@react-native-firebase/analytics';
import {firebase as db} from '@react-native-firebase/database';

import {FIREBASE_SETTINGS, ONESIGNAL_SETTINGS} from '@const';

export const getUserData = async () => {
  let userData = {};
  const columns = [
    'userID',
    'ip',
    'carrier',
    'brand',
    'buildID',
    'deviceID',
    'firstInstall',
    'model',
    'version',
    'buildNumber',
    'versionReadable',
    'userAgent',
  ];
  await Promise.all([
    getUniqueId(),
    getIpAddress(),
    getCarrier(),
    getBrand(),
    getBuildId(),
    getDeviceId(),
    getFirstInstallTime(),
    getModel(),
    getVersion(),
    getBuildNumber(),
    getReadableVersion(),
    getUserAgent(),
  ]).then(values => {
    userData = values.reduce((result, field, index) => {
      result[columns[index]] = field;
      return result;
    }, {});
    return userData;
  });
};

export const pushUserData = async () => {
  await getUserData().then(userData => {
    if (!userData?.userID) {
      return false;
    }
    firebase.analytics().setUserId(userData?.userID);
    db.app()
      .database(FIREBASE_SETTINGS.db.realTime.url)
      .ref('/users/' + userData?.userID)
      .set({
        user: {
          ip: userData?.ip,
          carrier: userData?.carrier !== 'unknown' ? userData?.carrier : null,
        },
        device: {
          deviceID: userData?.deviceID,
          os: Platform.OS,
          brand: userData?.brand,
          model: userData?.model,
          userAgent: userData?.userAgent,
        },
        app: {
          bundleID: userData?.bundleID,
          firstInstall: userData?.firstInstall,
          version: {
            version: userData?.version,
            build: userData?.buildNumber,
            fullVersion: userData?.versionReadable,
          },
        },
      });
  });
};

export default getUserData;
