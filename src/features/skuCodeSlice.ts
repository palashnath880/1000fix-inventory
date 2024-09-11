import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { SKUCode } from "../types/types";
import skuCodeApi from "../api/skuCode";

type InitialState = {
  loading: boolean;
  data: SKUCode[];
};

const initialState: InitialState = {
  loading: true,
  data: [],
};

const fetchSku = createAsyncThunk<SKUCode[], string>(
  "skuCodes",
  async (search) => {
    const res = await skuCodeApi.get(search);
    return res.data;
  }
);

export const skuCodeSlice = createSlice({
  name: "skuCodes",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchSku.pending, (state) => ({ ...state, loading: true }))
      .addCase(fetchSku.fulfilled, (_, action) => ({
        loading: false,
        data: action.payload,
      }))
      .addCase(fetchSku.rejected, (state) => ({ ...state, loading: false }));
  },
});

export { fetchSku };
export default skuCodeSlice.reducer;
