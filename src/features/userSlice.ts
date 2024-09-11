import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { User } from "../types/types";
import userApi from "../api/user";

type InitialState = {
  loading: boolean;
  data: User[];
};

const initialState: InitialState = {
  loading: true,
  data: [],
};

const fetchUsers = createAsyncThunk<User[], string>("users", async (search) => {
  const res = await userApi.get(search);
  return res.data;
});

export const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchUsers.pending, (state) => ({
        ...state,
        loading: true,
      }))
      .addCase(fetchUsers.fulfilled, (_, action) => ({
        loading: true,
        data: action.payload,
      }))
      .addCase(fetchUsers.rejected, (state) => ({
        ...state,
        loading: false,
      }));
  },
});

export { fetchUsers };
export default userSlice.reducer;
