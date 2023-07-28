import React, {useEffect, useRef} from 'react';
import {useColorScheme, Platform} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import NavBottom from '@nav/NavigationBottom';

import SplashScreen from 'react-native-splash-screen';
import * as Sentry from '@sentry/react-native';

import {FIREBASE_SETTINGS, SENTRY_SETTINGS, INITIAL_SCREEN} from '@const';

import {firebase} from '@react-native-firebase/app-check';
import {analyticsLog, logScreenView} from '@utils/analytics';
import {pushUserData} from '@utils/userData';
import {fetchFirmwareMeta} from '@utils/firmware';

import {navigationTheme} from '@styleConst';
import {GluestackUIProvider} from '@gluestack';
import {config} from '@const/gluestack-ui.config';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

// Construct a new instrumentation instance. This is needed to communicate between the integration and React
const routingInstrumentation = new Sentry.ReactNavigationInstrumentation();

Sentry.init({
  dsn: SENTRY_SETTINGS.dsn,
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production.
  tracesSampleRate: 1.0,
  integrations: [
    new Sentry.ReactNativeTracing({
      // Pass instrumentation to be used as `routingInstrumentation`
      routingInstrumentation,
      enableUserInteractionTracing: true,
    }),
  ],
});

const App = props => {
  const routeNameRef = useRef();
  const navigationRef = useRef();
  const phoneTheme = useColorScheme();

  const appCheck = async () => {
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
  };

  useEffect(() => {
    pushUserData();
    setTimeout(() => {
      SplashScreen.hide();
    }, 550);
    appCheck();
    analyticsLog('app_init', {os: Platform.OS, version: Platform.Version});
    fetchFirmwareMeta();
  }, []);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <GluestackUIProvider config={config.theme} colorMode={phoneTheme}>
        <NavigationContainer
          theme={navigationTheme[phoneTheme]}
          ref={navigationRef}
          onReady={() => {
            routeNameRef.current = navigationRef.current.getCurrentRoute().name;
            routingInstrumentation.registerNavigationContainer(navigationRef);
          }}
          onStateChange={async () => {
            const previousRouteName = routeNameRef.current;
            const currentRouteName =
              navigationRef.current.getCurrentRoute().name;

            if (previousRouteName !== currentRouteName) {
              await logScreenView(currentRouteName);
            }
            routeNameRef.current = currentRouteName;
          }}>
          <NavBottom initialRouteName={INITIAL_SCREEN} {...props} />
        </NavigationContainer>
      </GluestackUIProvider>
    </GestureHandlerRootView>
  );
};

export default Sentry.wrap(App);
