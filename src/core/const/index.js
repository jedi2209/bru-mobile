export const FIREBASE_SETTINGS = {
  appCheck: {
    android: {
      provider: __DEV__ ? 'debug' : 'playIntegrity',
      debugToken: 'XXXX',
    },
    apple: {
      provider: __DEV__ ? 'debug' : 'appAttestWithDeviceCheckFallback',
      debugToken: 'XXXX',
    },
  },
};

let LANGUAGES = {
  en: {
    name: 'English',
    code: 'en',
  },
  de: {
    name: 'Deutsch',
    code: 'de',
  },
};

export const LANGUAGE = {...LANGUAGES, default: LANGUAGES.en};

export const INITIAL_SCREEN = 'Profile';
