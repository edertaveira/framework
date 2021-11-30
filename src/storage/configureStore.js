import { createStore, applyMiddleware } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import logger from "redux-logger";

import appReducer from "../reducers/appReducer";

const DEBUG = process.env.NODE_ENV === "development";
const persistConfig = {
  key: "RootStorage",
  storage: storage,
};

const persistedReducer = persistReducer(persistConfig, appReducer);

const configureStore = () => {
  const middleware = [DEBUG && logger].filter(Boolean);
  const store = createStore(persistedReducer, applyMiddleware(...middleware));
  const persistor = persistStore(store);
  return { store, persistor };
};

export default configureStore;
