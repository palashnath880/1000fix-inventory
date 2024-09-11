import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Category } from "../types/types";
import categoryApi from "../api/category";

type InitialState = {
  loading: boolean;
  data: Category[];
};

const initialState: InitialState = {
  loading: true,
  data: [],
};

const fetchCategories = createAsyncThunk<Category[]>("categories", async () => {
  const res = await categoryApi.get();
  return res.data;
});

export const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchCategories.pending, (state) => ({
        ...state,
        loading: true,
      }))
      .addCase(fetchCategories.fulfilled, (_, action) => ({
        loading: false,
        data: action.payload,
      }))
      .addCase(fetchCategories.rejected, (state) => ({
        ...state,
        loading: false,
      }));
  },
});

export { fetchCategories };
export default categorySlice.reducer;
