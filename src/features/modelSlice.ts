import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Model } from "../types/types";
import modelApi from "../api/model";

type InitialState = {
  loading: boolean;
  data: Model[];
};

const initialState: InitialState = {
  loading: true,
  data: [],
};

const fetchModels = createAsyncThunk("models", async () => {
  const res = await modelApi.get();
  return res.data;
});

export const modelSlice = createSlice({
  name: "models",
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
export default modelSlice.reducer;
