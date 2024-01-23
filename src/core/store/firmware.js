import AsyncStorage from '@react-native-async-storage/async-storage';
import {createStore, createEvent, createEffect, forward} from 'effector';

const storeName = 'firmware';

export const setFirmware = createEvent();
export const resetFirmware = createEvent();

export const $currentFirmwareStore = createStore(
  {},
  {
    name: storeName,
  },
)
  .on(setFirmware, (_, data) => data)
  .reset(resetFirmware);

// $currentFirmwareStore.watch(state => {
//   console.log('$currentFirmwareStore changed', state);
// });

export const fetchFirmware = createEffect({
  async handler() {
    const value = await AsyncStorage.getItem(storeName);
    return JSON.parse(value);
  },
});

fetchFirmware.doneData.watch(result => {
  setFirmware(result);
});

export const updateFirmware = createEffect({
  async handler(data) {
    try {
      await AsyncStorage.setItem(storeName, JSON.stringify(data), err => {
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
  from: $currentFirmwareStore,
  to: updateFirmware,
});
