import {configureStore} from '@reduxjs/toolkit';
import {persistStore} from 'redux-persist';

import {coreReducer} from '@/store/reducer';

export const store = configureStore({
  reducer: coreReducer,
});

export const persistor = persistStore(store);
