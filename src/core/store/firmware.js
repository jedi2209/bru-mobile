import {createStore, createEvent} from 'effector';

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
