import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import branchReducer from "../features/branchSlice";
import userReducer from "../features/userSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    branches: branchReducer,
    users: userReducer,
  },
});

export { store };

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
