import React, {useEffect, useRef} from 'react';
import {Platform, StatusBar} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import NavMain from '@nav/Navigation';

import SplashScreen from 'react-native-splash-screen';

import {INITIAL_SCREEN} from '@const';

// import {firebase} from '@react-native-firebase/app-check';
import {analyticsLog, logScreenView} from '@utils/analytics';
import {pushUserData} from '@utils/userData';
import {fetchFirmwareMeta} from '@utils/firmware';

import {navigationTheme} from '@styleConst';
import {$themeStore} from './store/theme';
import {useStore} from 'effector-react';
import {isSignedIn} from '../utils/auth';
import Toast from 'react-native-toast-message';
import {colors} from './const/style';
import * as Sentry from '@sentry/react-native';

const routingInstrumentation = new Sentry.ReactNavigationInstrumentation();

export const AppNavigation = props => {
  const routeNameRef = useRef();
  const navigationRef = useRef();
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
    <NavigationContainer
      theme={navigationTheme[theme]}
      ref={navigationRef}
      onReady={() => {
        routeNameRef.current = navigationRef.current.getCurrentRoute().name;
        routingInstrumentation.registerNavigationContainer(navigationRef);
      }}
      onStateChange={async () => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = navigationRef.current.getCurrentRoute().name;

        if (previousRouteName !== currentRouteName) {
          await logScreenView(currentRouteName);
        }
        routeNameRef.current = currentRouteName;
      }}>
      <NavMain initialRouteName={INITIAL_SCREEN} {...props} />
      <Toast />
      <StatusBar backgroundColor={colors.green.header} />
    </NavigationContainer>
  );
};
