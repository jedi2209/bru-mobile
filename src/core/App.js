import React, {useEffect} from 'react';
import {Platform, LogBox} from 'react-native';

import SplashScreen from 'react-native-splash-screen';
import * as Sentry from '@sentry/react-native';

import {FIREBASE_SETTINGS, SENTRY_SETTINGS} from '@const';

// import {firebase} from '@react-native-firebase/app-check';
import {analyticsLog} from '@utils/analytics';
import {pushUserData} from '@utils/userData';
import {fetchFirmwareMeta} from '@utils/firmware';
import isInternet from '@utils/isInternet';

import {GluestackUIProvider} from '@gluestack-ui/themed';
import {config} from '../../config/gluestack-ui.config';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {$themeStore} from './store/theme';
import {useStore} from 'effector-react';
import {isSignedIn} from '../utils/auth';
import {firebase} from '@react-native-firebase/firestore';
import {AppNavigation} from './AppNavigation';
import PresetContextProvider from './contexts/PresetContextProvider';

// Construct a new instrumentation instance. This is needed to communicate between the integration and React
const routingInstrumentation = new Sentry.ReactNavigationInstrumentation();

let sentryParams = {
  dsn: SENTRY_SETTINGS.dsn,
  tracesSampleRate: 0.2,
  integrations: [
    new Sentry.ReactNativeTracing({
      routingInstrumentation,
      enableUserInteractionTracing: true,
      tracingOrigins: ['localhost', 'bru.shop', 'appspot.com'],
    }),
  ],
};

LogBox.ignoreLogs([
  'NativeBase: The contrast ratio of',
  "[react-native-gesture-handler] Seems like you're using an old API with gesture components, check out new Gestures system!",
  'If you do not provide children, you must specify an aria-label for accessibility',
  'Animated: `useNativeDriver` was not specified. This is a required option and must be explicitly set to `true` or `false`',
]);

if (__DEV__) {
  sentryParams = {
    dsn: SENTRY_SETTINGS.dsn,
    debug: false,
    tracesSampleRate: 1.0,
    integrations: [
      new Sentry.ReactNativeTracing({
        routingInstrumentation,
        enableUserInteractionTracing: false,
        tracingOrigins: ['localhost', 'bru.shop', 'appspot.com'],
      }),
    ],
  };
}

Sentry.init(sentryParams);

const _appCheckInit = async () => {
  const connectionStatus = await isInternet();
  if (!connectionStatus) {
    return false;
  }
  if (Platform.OS === 'android') {
    const rnfbProvider = firebase
      .appCheck()
      .newReactNativeFirebaseAppCheckProvider();
    rnfbProvider.configure(FIREBASE_SETTINGS.appCheck);
    try {
      firebase
        .appCheck()
        .initializeAppCheck({
          provider: rnfbProvider,
          isTokenAutoRefreshEnabled: true,
        })
        .then(async () => {
          try {
            const {token} = await firebase.appCheck().getToken(true);
            if (token.length > 0) {
              console.log('AppCheck verification passed');
            }
          } catch (error) {
            console.log('AppCheck verification failed', error);
          }
        });
    } catch (error) {
      console.error('AppCheck verification failed');
    }
  }
};

const App = props => {
  const theme = useStore($themeStore);
  useEffect(() => {
    isSignedIn();
  }, []);

  useEffect(() => {
    pushUserData();

    setTimeout(() => {
      SplashScreen.hide();
    }, 550);
    // _appCheckInit();
    analyticsLog('app_init', {os: Platform.OS, version: Platform.Version});
    fetchFirmwareMeta();
  }, []);

  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <GestureHandlerRootView style={{flex: 1}}>
      <GluestackUIProvider config={config} colorMode={theme}>
        <PresetContextProvider>
          <AppNavigation {...props} />
        </PresetContextProvider>
      </GluestackUIProvider>
    </GestureHandlerRootView>
  );
};

export default Sentry.wrap(App);
