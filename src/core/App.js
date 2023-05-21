/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useRef} from 'react';
import {StyleSheet, Text, useColorScheme, View, Platform} from 'react-native';
import {attachLogger} from 'effector-logger';
import AsyncStorage from '@react-native-community/async-storage';
import {createStore, createEvent, createEffect, forward} from 'effector';
import {useStore} from 'effector-react';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import NavBottom from '@nav/NavigationBottom';
import {GluestackUIProvider} from '@gluestack';
import {config} from '../../gluestack-ui.config';

import {firebase} from '@react-native-firebase/app-check';

import {Colors} from 'react-native/Libraries/NewAppScreen';

import SplashScreen from 'react-native-splash-screen';

import lang from '@lang';

import {analyticsLog, logScreenView} from '../utils/analytics';

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'rgb(255, 45, 85)',
    background: 'red',
  },
};

const Section = ({children, title}) => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const App = props => {
  const routeNameRef = useRef();
  const navigationRef = useRef();
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const appCheck = async () => {
    const rnfbProvider = firebase
      .appCheck()
      .newReactNativeFirebaseAppCheckProvider();
    rnfbProvider.configure({
      android: {
        provider: __DEV__ ? 'debug' : 'playIntegrity',
        debugToken: 'XXXX',
      },
      // apple: {
      //   provider: __DEV__ ? 'debug' : 'appAttestWithDeviceCheckFallback',
      //   debugToken: 'some token you have configured for your project firebase web console',
      // },
    });
    try {
      firebase.appCheck().initializeAppCheck({
        provider: rnfbProvider,
        isTokenAutoRefreshEnabled: true,
      });
    } catch (error) {
      console.log('AppCheck verification failed');
    }
  };

  useEffect(() => {
    appCheck();
    analyticsLog('app_open', {os: Platform.OS, version: Platform.Version});
    SplashScreen.hide();
    attachLogger();
    lang.setLanguage('en');
  }, []);

  return (
    <GluestackUIProvider config={config.theme}>
      <NavigationContainer
        theme={MyTheme}
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
        <NavBottom initialRouteName="Profile" {...props} />
      </NavigationContainer>
    </GluestackUIProvider>
  );
};

export default App;
