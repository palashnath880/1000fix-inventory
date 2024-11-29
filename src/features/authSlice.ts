import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { User } from "../types/types";
import Cookies from "js-cookie";
import userApi from "../api/user";

type Auth = {
  loading: boolean;
  user: User | null;
};

const initialState: Auth = {
  loading: true,
  user: null,
};

const authUser = createAsyncThunk(`user/me`, async () => {
  const re_token = Cookies.get("re_token");
  if (!re_token) {
    return null;
  }
  const res = await userApi.getMe();
  return res.data;
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logOut: () => {
      Cookies.remove("ac_token");
      Cookies.remove("re_token");
      window.location.href = "/login";
    },
  },
  extraReducers(builder) {
    builder
      .addCase(authUser.pending, () => ({
        loading: true,
        user: null,
      }))
      .addCase(authUser.fulfilled, (_, action) => ({
        loading: false,
        user: action.payload,
      }))
      .addCase(authUser.rejected, () => ({ user: null, loading: false }));
  },
});

export const { logOut } = authSlice.actions;
export { authUser };
export default authSlice.reducer;
