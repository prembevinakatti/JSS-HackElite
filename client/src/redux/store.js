// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authslice";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { combineReducers } from "redux";

// Define the persist configuration
const persistConfig = {
  key: "root",
  storage,
  version: 17570,
};

// Combine the reducers
const rootReducer = combineReducers({
  auth: authReducer,
});

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store with the persisted reducer
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
});

// Create a persistor
export const persistor = persistStore(store);

export default store;
