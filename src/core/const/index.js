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
  {label: units === 'metric' ? '50ml' : '2oz', value: 0},
  {label: units === 'metric' ? '100ml' : '3oz', value: 1},
  {label: units === 'metric' ? '150ml' : '5oz', value: 2},
  {label: units === 'metric' ? '200ml' : '7oz', value: 3},
  {label: units === 'metric' ? '250ml' : '9oz', value: 4},
  {label: units === 'metric' ? '300ml' : '10oz', value: 5},
  {label: units === 'metric' ? '350ml' : '12oz', value: 6},
];

export const temperaturePickerData = units => [
  {label: units === 'metric' ? 'Cold' : 'Cold', value: 0},
  {label: units === 'metric' ? '45°C' : '104°F', value: 1},
  {label: units === 'metric' ? '50°C' : '122°F', value: 2},
  {label: units === 'metric' ? '55°C' : '131°F', value: 3},
  {label: units === 'metric' ? '60°C' : '140°F', value: 4},
  {label: units === 'metric' ? '65°C' : '149°F', value: 5},
  {label: units === 'metric' ? '70°C' : '158°F', value: 6},
  {label: units === 'metric' ? '75°C' : '167°F', value: 7},
  {label: units === 'metric' ? '80°C' : '176°F', value: 8},
  {label: units === 'metric' ? '85°C' : '185°F', value: 9},
  {label: units === 'metric' ? '90°C' : '194°F', value: 10},
  {label: units === 'metric' ? '95°C' : '203°F', value: 11},
  {label: units === 'metric' ? 'Maximum' : 'Maximum', value: 12},
];

export const timePickerData = () => {
  const values = [];
  let counter = 0;
  for (let i = 0; i < 10; i++) {
    if (i) {
      values.push({label: `${i}:00`, value: counter++, seconds: i * 60});
    }
    for (let j = 1; j < 6; j++) {
      values.push({
        label: `${i}:${j * 10}`,
        value: counter++,
        seconds: i * 60 + j * 10,
      });
    }
  }

  for (let i = 10; i < 61; i++) {
    values.push({label: `${i}:00`, value: counter++, seconds: i * 60});
  }

  return values;
};

export const defaultPresets = [
  'assam_from_india',
  'sencha_japan',
  'ginger_lemon',
  'fresh_peach',
  'wild_mango',
  'jasmintee',
  'rooibos_marzipan',
  'premium_earl_grey',
  'evening_tea',
  'sweet_orange',
];
