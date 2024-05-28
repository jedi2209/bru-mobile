import {createEvent, createStore} from 'effector';

export const setDefaults = createEvent();

export const $defaultPressetsStore = createStore({}).on(
  setDefaults,
  (_, defaultPresets) => {
    const defaultIds = defaultPresets?.map(item => item.id) ?? [];
    return {defaultIds, defaultPresets};
  },
);
