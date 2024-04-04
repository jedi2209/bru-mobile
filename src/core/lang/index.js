import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from './en.json';
import de from './de.json';

export const languageResources = {
  en_US: {translation: en},
  de_US: {translation: de},
};

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  lng: 'en',
  fallbackLng: 'en_US',
  resources: languageResources,
});

export default i18n;
