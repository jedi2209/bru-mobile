import {createEvent, createStore} from 'effector';

export const setTime = createEvent();

export const $brewingTimeStore = createStore(0).on(setTime, (_, time) => time);
