import React, {useEffect, useRef} from 'react';
import {useColorScheme, Platform} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import NavBottom from '@nav/NavigationBottom';

import SplashScreen from 'react-native-splash-screen';

import {FIREBASE_SETTINGS, INITIAL_SCREEN} from '@const';

import {firebase} from '@react-native-firebase/app-check';
import {analyticsLog, logScreenView} from '../utils/analytics';

import {navigationTheme} from '@styleConst';
import {GluestackUIProvider} from '@gluestack';
import {config} from '../../gluestack-ui.config';

const App = props => {
  const routeNameRef = useRef();
  const navigationRef = useRef();
  const isDarkMode = useColorScheme() === 'dark';

  const appCheck = async () => {
    const rnfbProvider = firebase
      .appCheck()
      .newReactNativeFirebaseAppCheckProvider();
    rnfbProvider.configure(FIREBASE_SETTINGS.appCheck);
    try {
      firebase.appCheck().initializeAppCheck({
        provider: rnfbProvider,
        isTokenAutoRefreshEnabled: true,
      });
    } catch (error) {
      console.error('AppCheck verification failed');
    }
  };

  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 550);
    appCheck();
    analyticsLog('app_init', {os: Platform.OS, version: Platform.Version});
  }, []);

  return (
    <GluestackUIProvider config={config.theme}>
      <NavigationContainer
        theme={navigationTheme}
        ref={navigationRef}
        onReady={() => {
          routeNameRef.current = navigationRef.current.getCurrentRoute().name;
        }}
        onStateChange={async () => {
          const previousRouteName = routeNameRef.current;
          const currentRouteName = navigationRef.current.getCurrentRoute().name;

          if (previousRouteName !== currentRouteName) {
            await logScreenView(currentRouteName);
          }
          routeNameRef.current = currentRouteName;
        }}>
        <NavBottom initialRouteName={INITIAL_SCREEN} {...props} />
      </NavigationContainer>
    </GluestackUIProvider>
  );
};

export default App;
