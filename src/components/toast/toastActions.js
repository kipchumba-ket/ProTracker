import { createAction } from '@reduxjs/toolkit';

export const showNotification = createAction('SHOW_NOTIFICATION');
export const hideNotification = createAction('HIDE_NOTIFICATION');

export default {
    showNotification,
    hideNotification
  };