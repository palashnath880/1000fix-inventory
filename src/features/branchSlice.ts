import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Branch } from "../types/types";
import branchApi from "../api/branch";

type InitialState = {
  loading: boolean;
  branches: Branch[];
};
const initialState: InitialState = {
  branches: [],
  loading: true,
};

const fetchBranch = createAsyncThunk<Branch[], { search: string }>(
  "branches",
  async (params) => {
    const res = await branchApi.get(params.search);
    return res.data;
  }
);

export const branchSlice = createSlice({
  name: "branch",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchBranch.pending, (state) => ({ ...state, loading: true }))
      .addCase(fetchBranch.fulfilled, (_, action) => ({
        loading: false,
        branches: action.payload,
      }))
      .addCase(fetchBranch.rejected, (state) => ({ ...state, loading: false }));
  },
});

export { fetchBranch };
export default branchSlice.reducer;
