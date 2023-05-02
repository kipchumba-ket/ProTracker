import { createReducer } from "@reduxjs/toolkit";
import {
  showNotification,
  hideNotification,
} from "./toastActions";

const initialState = {
  message: "",
  type: "",
  level: "",
  toast_state: "inactive",
};

const notificationsReducer = createReducer(initialState, {
  [showNotification]: (state, action) => {
    state.message = action.payload.message;
    state.type = action.payload.type;
    state.level = action.payload.level;
    state.toast_state = "active";
  },
  [hideNotification]: (state) => {
    state.message = "";
    state.type = "";
    state.level = "";
    state.isActive = false;
  },
});

export default notificationsReducer;
