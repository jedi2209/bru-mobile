import AsyncStorage from '@react-native-async-storage/async-storage';
import {combineReducers} from '@reduxjs/toolkit';
import {persistReducer} from 'redux-persist';

import {userReducers} from './modules';

const userPersisted = persistReducer(
  {
    key: 'user',
    version: 1,
    storage: AsyncStorage,
    whitelist: ['isAuth'],
  },
  userReducers,
);

export const coreReducer = combineReducers({
  user: userPersisted,
});
