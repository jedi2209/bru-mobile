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
  dsn: 'https://XXXX@o4506937998049280.ingest.us.sentry.io/4506937999556608',
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

export const waterPickerData = units => [
  {label: units === 'metric' ? '150ml' : '5oz', value: 150},
  {label: units === 'metric' ? '200ml' : '7oz', value: 200},
  {label: units === 'metric' ? '250ml' : '8oz', value: 250},
  {label: units === 'metric' ? '300ml' : '10oz', value: 300},
  {label: units === 'metric' ? '350ml' : '12oz', value: 350},
  {label: units === 'metric' ? '400ml' : '13oz', value: 400},
  {label: units === 'metric' ? '450ml' : '15oz', value: 450},
  {label: units === 'metric' ? '500ml' : '17oz', value: 500},
];

export const temperaturePickerData = units => [
  {label: units === 'metric' ? 'Cold' : 'Cold', value: 0},
  {label: units === 'metric' ? '40°C' : '104°F', value: 40},
  {label: units === 'metric' ? '45°C' : '113°F', value: 45},
  {label: units === 'metric' ? '50°C' : '122°F', value: 50},
  {label: units === 'metric' ? '55°C' : '131°F', value: 55},
  {label: units === 'metric' ? '60°C' : '140°F', value: 60},
  {label: units === 'metric' ? '65°C' : '149°F', value: 65},
  {label: units === 'metric' ? '70°C' : '158°F', value: 70},
  {label: units === 'metric' ? '75°C' : '167°F', value: 75},
  {label: units === 'metric' ? '80°C' : '176°F', value: 80},
  {label: units === 'metric' ? '85°C' : '185°F', value: 85},
  {label: units === 'metric' ? '90°C' : '194°F', value: 90},
  {label: units === 'metric' ? '95°C' : '203°F', value: 95},
  {label: units === 'metric' ? '100°C' : '212°F', value: 100},
];
