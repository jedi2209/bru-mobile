import {createStore, createEvent} from 'effector';

export const setDeviceFirmware = createEvent();

export const $currentDeviceFirmwareStore = createStore('').on(
  setDeviceFirmware,
  (_, data) => data,
);
