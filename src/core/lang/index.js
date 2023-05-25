import {NativeModules, Platform, I18nManager} from 'react-native';
import {I18n} from 'i18n-js';
import memoize from 'lodash.memoize'; // Use for caching/memoize for better performance

import {setLanguage, initLanguage} from '@store/lang';

const i18n = new I18n();

const translationGetters = {
  // lazy requires (metro bundler does not support symlinks)
  en: () => require('./en.json'),
  de: () => require('./de.json'),
};

export const translate = memoize(
  (key, config) => i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key),
);

export const setI18nConfig = async (lang = null) => {
  if (!lang) {
    const deviceLanguage =
      Platform.OS === 'ios'
        ? NativeModules.SettingsManager.settings.AppleLocale ||
          NativeModules.SettingsManager.settings.AppleLanguages[0] //iOS 13
        : NativeModules.I18nManager.localeIdentifier;

    lang = deviceLanguage.includes('de') ? 'de' : 'en';
  }

  // clear translation cache
  translate.cache.clear();
  // update layout direction
  I18nManager.forceRTL(false);
  // set i18n-js config
  i18n.translations = {[lang]: translationGetters[lang]()};
  i18n.locale = lang;
};

setLanguage.watch(lang => setI18nConfig(lang));
initLanguage.watch(lang => setI18nConfig(lang));
