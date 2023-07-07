import AsyncStorage from '@react-native-community/async-storage';
import {createStore, createEvent, createEffect, forward} from 'effector';

const storeName = 'device';

export const setDevice = createEvent();
export const initDevice = createEvent();
const reset = createEvent();

export const $deviceSettingsStore = createStore(
  {},
  {
    name: storeName,
  },
)
  .on(setDevice, (_, device) => JSON.stringify(device))
  .on(initDevice, (_, device) => JSON.stringify(device))
  .reset(reset);

const fetchDevice = createEffect({
  async handler() {
    const value = await AsyncStorage.getItem(storeName);
    return JSON.parse(value);
  },
});

fetchDevice.doneData.watch(result => {
  initDevice(result);
});

export const updateDevice = createEffect({
  async handler(device) {
    try {
      await AsyncStorage.setItem(storeName, device, err => {
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
