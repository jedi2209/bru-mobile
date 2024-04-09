import {createEffect, createStore} from 'effector';
import {Appearance} from 'react-native';
import {getCurrentUser, updateUser} from '../../utils/db/auth';
import auth from '@react-native-firebase/auth';

const defaultTheme = Appearance.getColorScheme();

export const setThemeFx = createEffect(async theme => {
  const uid = auth().currentUser.uid;
  try {
    await updateUser(uid, {theme});
  } catch (error) {
    console.log(error);
  }
  return theme;
});
export const initThemeFx = createEffect(async () => {
  const user = await getCurrentUser();
  return user.theme;
});

export const $themeStore = createStore(defaultTheme)
  .on(initThemeFx.doneData, (_, theme) => {
    return theme ? theme : defaultTheme;
  })
  .on(setThemeFx.doneData, (_, theme) => theme);

export const isDarkMode = $themeStore.getState() === 'dark';
