import AsyncStorage from '@react-native-community/async-storage';
import {createStore, createEvent, createEffect, forward} from 'effector';

import {LANGUAGE} from '@const';

const storeName = 'AppLang';

const initAppLang = createEvent();
const setLanguage = createEvent();
const reset = createEvent();

const $langSettingsStore = createStore(LANGUAGE.default.code, {name: storeName})
  .on(setLanguage, lang => lang)
  .on(initAppLang, (state, value) => value)
  .reset(reset);

export const fetchLang = createEffect({
  async handler() {
    const value = await AsyncStorage.getItem(storeName);
    return value ? value : LANGUAGE.default.code;
  },
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
