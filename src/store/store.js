import {combineReducers, configureStore} from "@reduxjs/toolkit"
import authSlice from './authSlice'
import postSlice from "./postSlice";
import commentSlice from "./commentSlice";
import userSlice from "./userSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";


const persistConfig = {
  key: "root",
  storage,
  whitelist: ['auth'] // Only persist the 'auth' slice
}

const rootReducer = combineReducers({
  auth: authSlice,
  user: userSlice,
  posts: postSlice,
  comments: commentSlice,
})

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),

});

export const persistor = persistStore(store)
export default store
