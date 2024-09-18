import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import branchReducer from "../features/branchSlice";
import userReducer from "../features/userSlice";
import skuCodeReducer from "../features/skuCodeSlice";
import categoryReducer from "../features/categorySlice";
import modelReducer from "../features/modelSlice";
import itemReducer from "../features/itemSlice";
import headerReducer from "../features/headerSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    branches: branchReducer,
    users: userReducer,
    skuCodes: skuCodeReducer,
    categories: categoryReducer,
    models: modelReducer,
    items: itemReducer,
    header: headerReducer,
  },
});

export { store };

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
