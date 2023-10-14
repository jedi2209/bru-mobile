import AsyncStorage from '@react-native-community/async-storage';
import {createStore, createEvent, createEffect, forward} from 'effector';
import {get} from 'lodash';

const storeName = 'device';

export const initDevice = createEvent();
export const setDevice = createEvent();
export const resetDevice = createEvent();

export const $deviceSettingsStore = createStore([], {
  name: storeName,
})
  .on(setDevice, (state, device) => {
    if (!device?.id) {
      return [...state];
    }
    const isObjectExists = state.some(obj => obj.id === device.id);
    if (!isObjectExists) {
      state.forEach((obj, index) => {
        state[index].current = false;
      });
      device.isCurrent = true;
      // If device is not exists in state, then add it
      state.push(device);
    }
    return [...state];
  })
  .on(initDevice, (_, device) => {
    if (get(device, 'length')) {
      return [...device];
    }
    return [];
  })
  .reset(resetDevice);

// $deviceSettingsStore.watch(state => {
//   console.info(
//     '============= $deviceSettingsStore changed =============',
//     state,
//   );
// });

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
