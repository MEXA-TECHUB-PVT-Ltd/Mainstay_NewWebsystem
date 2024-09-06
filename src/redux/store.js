import storage from "redux-persist/lib/storage";
import { dashboardApi } from "./dashboardApi";
import rootReducer from "./rootReducer";
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";

const persistConfig = {
  key: "root",
  storage,
  blacklist: [
    "navbar",
    "layout",
    "videoSessionSlice",
    dashboardApi.reducerPath,
  ],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: false,
    }).concat(dashboardApi.middleware);
  },
});

export const persistor = persistStore(store);
