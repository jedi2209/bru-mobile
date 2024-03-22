import AsyncStorage from '@react-native-async-storage/async-storage';
import {createStore, createEvent, createEffect} from 'effector';

const storeName = 'previos';

export const initDevice = createEffect(async () => {
  const device = await AsyncStorage.getItem(storeName);
  return JSON.parse(device);
});
export const setDevice = createEffect(async device => {
  await AsyncStorage.setItem(storeName, JSON.stringify(device));
  return device;
});
export const resetDevice = createEffect(async () => {
  await AsyncStorage.setItem(storeName, null);
});

export const $connectedDevice = createStore(null)
  .on(initDevice.doneData, (_, device) => device)
  .on(setDevice.doneData, (_, device) => device)
  .on(resetDevice, () => null);
