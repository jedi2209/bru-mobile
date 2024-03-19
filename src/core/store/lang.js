import AsyncStorage from '@react-native-async-storage/async-storage';
import {createStore, createEvent, createEffect, forward} from 'effector';

import i18n from '../lang/index';
import {LANGUAGE} from '../const/index';

const storeName = 'appLang';

export const setLanguage = createEvent();
export const initLanguage = createEvent();
const reset = createEvent();

export const $langSettingsStore = createStore(LANGUAGE.default.code, {
  name: storeName,
})
  .on(setLanguage, (_, lang) => {
    i18n.changeLanguage(lang);
    return lang;
  })
  .on(initLanguage, (_, lang) => lang)
  .reset(reset);

const fetchLang = createEffect({
  async handler() {
    const value = await AsyncStorage.getItem(storeName);
    i18n.changeLanguage(value ? value : LANGUAGE.default.code);
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
