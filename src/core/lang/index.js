import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from './en.json';
import de from './de.json';
import it from './it.json';
import es from './es.json';
import fr from './fr.json';

export const languageResources = {
  en: {translation: en},
  de: {translation: de},
  it: {translation: it},
  es: {translation: es},
  fr: {translation: fr},
};

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  lng: 'en',
  fallbackLng: 'en',
  resources: languageResources,
});

export default i18n;
