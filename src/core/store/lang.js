import AsyncStorage from '@react-native-async-storage/async-storage';
import {createStore, createEvent, createEffect, forward} from 'effector';

import i18n from '../lang/index';
import {LANGUAGE} from '../const/index';
import {NativeModules, Platform} from 'react-native';
import {hasTranslation} from '../../helpers/hasTranslation';

const storeName = 'appLang';

const deviceLanguage =
  Platform.OS === 'ios'
    ? NativeModules.SettingsManager.settings.AppleLocale ||
      NativeModules.SettingsManager.settings.AppleLanguages[0] //iOS 13
    : NativeModules.I18nManager.localeIdentifier;

export const setLanguage = createEffect(async lang => {
  await AsyncStorage.setItem(storeName, lang);
  i18n.changeLanguage(lang);
});
export const initLanguage = createEffect(async () => {
  const savedLang = await AsyncStorage.getItem(storeName);
  if (hasTranslation(deviceLanguage)) {
    i18n.changeLanguage(savedLang || deviceLanguage);
    return savedLang || deviceLanguage;
  } else {
    i18n.changeLanguage('en_US');
    return 'en_US';
  }
});
const reset = createEvent();

export const $langSettingsStore = createStore(LANGUAGE.default.code, {
  name: storeName,
})
  .on(initLanguage.doneData, (_, lang) => lang)
  .on(setLanguage, (_, lang) => {
    i18n.changeLanguage(lang);
    AsyncStorage.setItem('appLang', lang);
    return lang;
  })
  .reset(reset);

initLanguage();
