import {createEffect, createStore} from 'effector';
import {Appearance} from 'react-native';
import {getCurrentUser, updateUser} from '../../utils/db/auth';
import auth from '@react-native-firebase/auth';

const defaultTheme = Appearance.getColorScheme();

export const setThemeFx = createEffect(async theme => {
  const uid = auth().currentUser.uid;
  await updateUser(uid, {theme});
  return theme;
});
export const initThemeFx = createEffect(async () => {
  const user = await getCurrentUser();
  console.log(user.theme, 'useruser');
  return user.theme;
});

export const $themeStore = createStore(defaultTheme)
  .on(initThemeFx.doneData, (_, theme) => {
    console.log(theme, 'themethemethemethemetheme');
    return theme ? theme : defaultTheme;
  })
  .on(setThemeFx.doneData, (_, theme) => theme);

export const isDarkMode = $themeStore.getState() === 'dark';
