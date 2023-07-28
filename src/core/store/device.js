import AsyncStorage from '@react-native-community/async-storage';
import {createStore, createEvent, createEffect, forward} from 'effector';

const storeName = 'device';

export const setDevice = createEvent();
export const resetDevice = createEvent();

export const $deviceSettingsStore = createStore(
  {},
  {
    name: storeName,
  },
)
  .on(setDevice, (_, device) => device)
  .reset(resetDevice);

// $deviceSettingsStore.watch(state => {
//   console.log('$deviceSettingsStore changed', state);
// });

const fetchDevice = createEffect({
  async handler() {
    const value = await AsyncStorage.getItem(storeName);
    return JSON.parse(value);
  },
});

fetchDevice.doneData.watch(result => {
  setDevice(result);
});

export const updateDevice = createEffect({
  async handler(device) {
    try {
      await AsyncStorage.setItem(storeName, JSON.stringify(device), err => {
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
  from: $deviceSettingsStore,
  to: updateDevice,
});

fetchDevice();
