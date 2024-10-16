import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import userReducer from "../features/userSlice";
import headerReducer from "../features/headerSlice";
import utilsReducer from "../features/utilsSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    header: headerReducer,
    utils: utilsReducer,
  },
});

export { store };

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
