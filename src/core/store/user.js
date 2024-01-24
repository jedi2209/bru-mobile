import {createEvent, createStore} from 'effector';

export const setUser = createEvent();
export const setIsLoading = createEvent();

export const $userStore = createStore(false).on(setUser, (_, user) => user);

export const $loadingAuthStore = createStore(false).on(
  setIsLoading,
  (_, loadig) => loadig,
);
