import AsyncStorage from '@react-native-async-storage/async-storage';
import {createStore, createEvent, createEffect} from 'effector';

import i18n from '../lang/index';
import {LANGUAGE} from '../const/index';
import {NativeModules, Platform} from 'react-native';
import {hasTranslation} from '../../helpers/hasTranslation';

const storeName = 'appLang';

const deviceLanguage =
  Platform.OS === 'ios'
    ? NativeModules.SettingsManager.settings.AppleLanguages[0] || //iOS 13
      NativeModules.SettingsManager.settings.AppleLocale
    : NativeModules.I18nManager.localeIdentifier;

export const setLanguage = createEffect(async lang => {
  await AsyncStorage.setItem(storeName, lang);
  i18n.changeLanguage(lang);
});
export const initLanguage = createEffect(async () => {
  // await AsyncStorage.removeItem(storeName);
  // const savedLang = await AsyncStorage.getItem(storeName);

  const deviceLanguageName = deviceLanguage.slice(0, 2);
  if (hasTranslation(deviceLanguageName)) {
    i18n.changeLanguage(deviceLanguageName);
    return deviceLanguageName;
  } else {
    i18n.changeLanguage('en');

    return 'en';
  }
});
const reset = createEvent();

export const $langSettingsStore = createStore(LANGUAGE.default.code, {
  name: storeName,
})
  .on(initLanguage.doneData, (_, lang) => lang)
  .on(setLanguage, (_, lang) => lang)
  .reset(reset);

initLanguage();
