import {createEffect, createEvent, createStore} from 'effector';
import {getCurrentUser} from '../../utils/db/auth';

export const getUserFx = createEffect(async () => {
  return await getCurrentUser();
});

export const setProfileUser = createEvent();

export const updateProfileUser = createEvent();

export const $profileStore = createStore({})
  .on(getUserFx.doneData, (_, user) => user)
  .on(setProfileUser, (_, user) => user)
  .on(updateProfileUser, (state, data) => ({...state, ...data}));
