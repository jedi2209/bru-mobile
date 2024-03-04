import storage from '@react-native-firebase/storage';
import {$currentFirmwareStore, setFirmware} from '@store/firmware';
import {$langSettingsStore} from '@store/lang';
import RNFS, {exists, downloadFile as fsDownloadFile} from 'react-native-fs';

import {FIREBASE_SETTINGS} from '@const';
import moment from 'moment';
import {get} from 'lodash';

const filePath = storage().ref(FIREBASE_SETTINGS.storage.firmware.rules.path);
const currLang = $langSettingsStore.getState();

export const downloadFile = async (url, fileName) => {
  const dir = RNFS.DocumentDirectoryPath;
  const localFile = `${dir}/${fileName}`;
  //Define path to store file along with the extension
  const headers = {
    Accept: 'application/octet-stream',
  };
  //Define options
  const options = {
    fromUrl: url,
    toFile: localFile,
    headers: headers,
  };

  if (await exists(localFile)) {
    return localFile;
  } else {
    return await fsDownloadFile(options)
      .promise.then(res => {
        if (res && res.statusCode === 200 && res.bytesWritten > 0) {
          return localFile;
        } else {
          console.error('ERROR fsDownloadFile', res);
          return false;
        }
      })
      .catch(error => {
        console.error('Download file error: ', error);
        return false;
      });
  }
};

export const getFileURL = async path => {
  return await storage()
    .ref(path)
    .getDownloadURL()
    .catch(err => {
      console.error('getFileURL error ' + path, err);
      return false;
    });
};

export const fetchFirmwareMeta = async () => {
  filePath.getMetadata().then(async metadata => {
    const localFirmwareFileDate = get(
      $currentFirmwareStore.getState(),
      'meta.lastUpdated',
    );
    console.log(
      localFirmwareFileDate,
      'localFirmwareFileDatelocalFirmwareFileDatelocalFirmwareFileDatelocalFirmwareFileDate',
    );
    const remoteFirmwareFileDate = moment.utc(metadata.updated).unix();
    if (
      !localFirmwareFileDate ||
      remoteFirmwareFileDate > localFirmwareFileDate
    ) {
      return await getFirmwareData().then(firmwares => {
        setFirmware({
          meta: {lastUpdated: remoteFirmwareFileDate},
          data: firmwares,
        });
      });
    }
  });
};

export const getFirmwareData = async () => {
  return filePath.getDownloadURL().then(path => {
    return fetch(path)
      .then(async response => {
        return await response.json().then(jsonAnswer => {
          if (get(jsonAnswer, 'data')) {
            return jsonAnswer.data;
          } else {
            return [];
          }
        });
      })
      .catch(err => console.error);
  });
};

export const getTextFromFirmware = (data, type = 'base', lang = currLang) => {
  let answer = null;
  const descriptionBase = get(data, type, get(data, lang, null));
  if (
    descriptionBase &&
    descriptionBase.length > 0 &&
    typeof descriptionBase === 'object'
  ) {
    answer = [];
    descriptionBase.map(el => {
      if (!el[lang]) {
        return;
      }
      answer.push(el[lang]);
    });
    answer = answer.join('\n');
  } else if (typeof descriptionBase === 'string') {
    answer = descriptionBase;
  }
  return answer;
};
