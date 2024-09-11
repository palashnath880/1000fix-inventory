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

const fetchItems = createAsyncThunk("items", async () => {
  const res = await itemApi.get();
  return res.data;
});

export const itemSlice = createSlice({
  name: "items",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchItems.pending, (state) => ({
        ...state,
        loading: true,
      }))
      .addCase(fetchItems.fulfilled, (_, action) => ({
        loading: false,
        data: action.payload,
      }))
      .addCase(fetchItems.rejected, (state) => ({ ...state, loading: false }));
  },
});

export { fetchItems };
export default itemSlice.reducer;
