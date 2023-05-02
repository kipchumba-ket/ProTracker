import { combineReducers } from 'redux';

import { configureStore } from '@reduxjs/toolkit';
import notificationsReducer from './toast/toastsReducer';


const store = configureStore({
  reducer: {
    notifications: notificationsReducer
  }
});

export default store;
