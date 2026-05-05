import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice.js";
import insightReducer from "./insightSlice.js";
import taskReducer from "./taskSlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    insights: insightReducer,
    tasks: taskReducer
  }
});
