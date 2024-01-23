import {createEvent, createStore} from 'effector';
import {Appearance} from 'react-native';

const defaultTheme = Appearance.getColorScheme();

export const setTheme = createEvent();

export const $themeStore = createStore(defaultTheme).on(
  setTheme,
  (_, theme) => theme,
);

export const isDarkMode = $themeStore.getState() === 'dark';
