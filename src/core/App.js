/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import {StyleSheet, Text, useColorScheme, View} from 'react-native';
import {attachLogger} from 'effector-logger';
import AsyncStorage from '@react-native-community/async-storage';
import {createStore, createEvent, createEffect, forward} from 'effector';
import {useStore} from 'effector-react';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import NavBottom from '@nav/NavigationBottom';
import {GluestackUIProvider} from '@gluestack';
import {config} from '../../gluestack-ui.config';

import {Colors} from 'react-native/Libraries/NewAppScreen';

import SplashScreen from 'react-native-splash-screen';

import lang from '@lang';

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
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    SplashScreen.hide();
    attachLogger();
    lang.setLanguage('en');
  }, []);

  return (
    <GluestackUIProvider config={config.theme}>
      <NavigationContainer theme={MyTheme}>
        <NavBottom initialRouteName="Profile" {...props} />
      </NavigationContainer>
    </GluestackUIProvider>
  );
};

export default App;
