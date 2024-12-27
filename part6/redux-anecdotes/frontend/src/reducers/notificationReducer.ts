import { createSlice } from '@reduxjs/toolkit';
import { AppDispatch } from '../store';

const initialState = null;

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification: (state, action) => action.payload,
    clearNotification: () => initialState,
  },
});

const { actions, reducer } = notificationSlice;
export const { setNotification, clearNotification } = actions;

export const showNotification = (message : string, time : number) => {
  return async (dispatch: AppDispatch) => {
      dispatch(setNotification(message))
      setTimeout(() => {
          dispatch(clearNotification())
      }, time * 1000)
    }
}

export default reducer