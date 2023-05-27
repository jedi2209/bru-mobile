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
  storage: {
    bucket: 'gs://brutea-app.appspot.com',
  },
  db: {
    realTime: {
      url: 'https://XXXX.europe-west1.firebasedatabase.app/',
    },
  },
};

export const ONESIGNAL_SETTINGS = {
  appID: 'XXXX',
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
