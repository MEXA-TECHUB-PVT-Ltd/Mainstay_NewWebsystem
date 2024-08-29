// ** Reducers Imports
import layout from "./layout";
import navbar from "./navbar";
import videoSessionSlice from "./videoSessionSlice";
import { dashboardApi } from "./dashboardApi";
import languageSlice from "./languageSlice";

const rootReducer = {
  navbar,
  layout,
  videoSessionSlice,
  languageSlice,
  [dashboardApi.reducerPath]: dashboardApi.reducer,
};

export default rootReducer;
