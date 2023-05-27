import AsyncStorage from '@react-native-community/async-storage';
import {createStore, createEvent, createEffect, forward} from 'effector';

import {LANGUAGE} from '@const';

const storeName = 'appLang';

export const setLanguage = createEvent();
export const initLanguage = createEvent();
const reset = createEvent();

export const $langSettingsStore = createStore(LANGUAGE.default.code, {
  name: storeName,
})
  .on(setLanguage, (_, lang) => lang)
  .on(initLanguage, (_, lang) => lang)
  .reset(reset);

const fetchLang = createEffect({
  async handler() {
    const value = await AsyncStorage.getItem(storeName);
    return value ? value : LANGUAGE.default.code;
  },
});

fetchLang.doneData.watch(result => {
  initLanguage(result);
});

export const updateLang = createEffect({
  async handler(lang) {
    try {
      await AsyncStorage.setItem(storeName, lang, err => {
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
  from: $langSettingsStore,
  to: updateLang,
});

fetchLang();
