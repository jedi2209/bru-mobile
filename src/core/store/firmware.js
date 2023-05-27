import AsyncStorage from '@react-native-community/async-storage';
import {createStore, createEvent, createEffect, forward} from 'effector';

import {getUniqueId} from 'react-native-device-info';

import {firebase as analytics} from '@react-native-firebase/analytics';
import {firebase as storage} from '@react-native-firebase/storage';
import {firebase as db} from '@react-native-firebase/database';

import {FIREBASE_SETTINGS} from '@const';

getUniqueId().then(id => {
  console.log('getUniqueId', id);
  // const reference = db
  // .app()
  // .database(FIREBASE_SETTINGS.db.realtime.url)
  // .ref('/users/123');
});

const storeName = 'firmware';

export const setFirmware = createEvent();
export const initFirmware = createEvent();
const reset = createEvent();

export const $currentFirmware = createStore(null, {
  name: storeName,
})
  .on(setFirmware, (_, data) => data)
  .on(initFirmware, (_, data) => data)
  .reset(reset);

const fetchFirmware = createEffect({
  async handler() {
    const value = await AsyncStorage.getItem(storeName);
    return value ? value : null;
  },
});

fetchFirmware.doneData.watch(result => {
  initFirmware(result);
});

export const updateFirmware = createEffect({
  async handler(data) {
    try {
      await AsyncStorage.setItem(storeName, data, err => {
        if (err) {
          console.error(err);
        }
      });
    } catch (err) {
      console.error(err);
    }
  },
});

forward({
  from: $currentFirmware,
  to: updateFirmware,
});

const listFilesAndDirectories = (reference, pageToken) => {
  return reference.list({pageToken}).then(result => {
    // Loop over each item
    result.items.forEach(ref => {
      console.log('path', ref.fullPath);
    });

    if (result.nextPageToken) {
      return listFilesAndDirectories(reference, result.nextPageToken);
    }

    return Promise.resolve();
  });
};

const firmwareRef = storage
  .app()
  .storage(FIREBASE_SETTINGS.storage.bucket)
  .ref(storeName);

listFilesAndDirectories(firmwareRef).then(() => {
  console.log('Finished listing');
});
