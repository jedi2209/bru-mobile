export const FIREBASE_SETTINGS = {
  appCheck: {
    android: {
      provider: __DEV__ ? 'debug' : 'playIntegrity',
      // debugToken: 'XXXX',
      debugToken: 'XXXX',
    },
    apple: {
      provider: __DEV__ ? 'debug' : 'appAttestWithDeviceCheckFallback',
      debugToken: 'XXXX',
    },
  },
  storage: {
    bucket: 'gs://brutea-app.appspot.com',
    firmware: {
      rules: {
        path: 'firmware/update-rules.json',
      },
    },
  },
  db: {
    realTime: {
      url: 'https://XXXX.europe-west1.firebasedatabase.app/',
    },
  },
};

export const SENTRY_SETTINGS = {
  dsn: 'https://81e7ded58f57472f84bdb5686bbd0fe7@o76005.ingest.sentry.io/4505266371231744',
};

export const ONESIGNAL_SETTINGS = {
  appID: 'XXXX',
};

let LANGUAGES = {
  en: {
    name: 'English',
    code: 'en',
    urls: {
      help: 'https://bru.shop/en-eu/pages/help',
    },
  },
  de: {
    name: 'Deutsch',
    code: 'de',
    urls: {
      help: 'https://bru.shop/pages/help',
    },
  },
};

export const DEVICE_MANAGER_CONFIG = {
  prefix: 'BRU',
  secondsToScan: 3,
  allowDuplicates: false,
};

export const LANGUAGE = {...LANGUAGES, default: LANGUAGES.en};

export const INITIAL_SCREEN = 'InstantBrew';
