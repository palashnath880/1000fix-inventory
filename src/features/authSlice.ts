import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { User } from "../types/types";
import authApi from "../api/auth";
import Cookies from "js-cookie";

type Auth = {
  loading: boolean;
  user: User | null;
};

const initialState: Auth = {
  loading: true,
  user: null,
};

const loadUser = createAsyncThunk(`auth/user`, async () => {
  const res = await authApi.verify();
  return res.data;
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logOut: () => {
      Cookies.remove("auth_token");
      window.location.href = "/";
    },
  },
  extraReducers(builder) {
    builder
      .addCase(loadUser.pending, () => ({
        loading: true,
        user: null,
      }))
      .addCase(loadUser.fulfilled, (_, action) => ({
        loading: false,
        user: action.payload,
      }))
      .addCase(loadUser.rejected, () => ({ user: null, loading: false }));
  },
});

export const { logOut } = authSlice.actions;
export { loadUser };
export default authSlice.reducer;
