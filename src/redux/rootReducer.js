// ** Reducers Imports
import layout from "./layout";
import navbar from "./navbar";
import videoSessionSlice from "./videoSessionSlice";
import { dashboardApi } from "./dashboardApi";
import languageSlice from "./languageSlice";
import { combineReducers } from "@reduxjs/toolkit";

const rootReducer = combineReducers({
  navbar,
  layout,
  videoSessionSlice,
  languageSlice,
  [dashboardApi.reducerPath]: dashboardApi.reducer,
});

export default rootReducer;
