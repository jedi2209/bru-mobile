import AsyncStorage from '@react-native-async-storage/async-storage';
import {createStore, createEvent, createEffect, forward} from 'effector';

import i18n from '../lang/index';
import {LANGUAGE} from '../const/index';
import {NativeModules, Platform} from 'react-native';
import {hasTranslation} from '../../helpers/hasTranslation';

const storeName = 'appLang';

export const setLanguage = createEvent();
export const initLanguage = createEvent();
const reset = createEvent();

const deviceLanguage =
  Platform.OS === 'ios'
    ? NativeModules.SettingsManager.settings.AppleLocale ||
      NativeModules.SettingsManager.settings.AppleLanguages[0] //iOS 13
    : NativeModules.I18nManager.localeIdentifier;

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
    if (hasTranslation(deviceLanguage)) {
      i18n.changeLanguage(deviceLanguage);
      return deviceLanguage;
    } else {
      i18n.changeLanguage('en_US');
      return 'en_US';
    }
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
