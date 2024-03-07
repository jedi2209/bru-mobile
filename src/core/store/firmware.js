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
