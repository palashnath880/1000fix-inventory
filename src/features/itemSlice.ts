import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Item } from "../types/types";
import itemApi from "../api/item";

type InitialState = {
  loading: boolean;
  data: Item[];
};

const initialState: InitialState = {
  loading: true,
  data: [],
};

const fetchModels = createAsyncThunk("items", async () => {
  const res = await itemApi.get();
  return res.data;
});

export const itemSlice = createSlice({
  name: "items",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchModels.pending, (state) => ({
        ...state,
        loading: true,
      }))
      .addCase(fetchModels.fulfilled, (_, action) => ({
        loading: false,
        data: action.payload,
      }))
      .addCase(fetchModels.rejected, (state) => ({ ...state, loading: false }));
  },
});

export { fetchModels };
export default itemSlice.reducer;
