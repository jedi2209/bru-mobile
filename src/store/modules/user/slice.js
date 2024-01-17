import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  isAuth: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAuth: (state, {payload}) => {
      state.isAuth = payload;
    },
  },
});

export const userReducers = userSlice.reducer;
export const {setAuth} = userSlice.actions;
