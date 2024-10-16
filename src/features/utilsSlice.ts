import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Branch, Category, Item, Model, SKUCode, UOM } from "../types/types";
import skuCodeApi from "../api/skuCode";
import modelApi from "../api/model";
import itemApi from "../api/item";
import categoryApi from "../api/category";
import branchApi from "../api/branch";
import uomApi from "../api/uom";

// initial state type
type InitialState = {
  uoms: { loading: boolean; data: UOM[] };
  models: { loading: boolean; data: Model[] };
  items: { loading: boolean; data: Item[] };
  branches: { loading: boolean; data: Branch[] };
  categories: { loading: boolean; data: Category[] };
  skuCodes: { loading: boolean; data: SKUCode[] };
};

// initial state
const initialState: InitialState = {
  branches: { loading: true, data: [] },
  categories: { loading: true, data: [] },
  items: { loading: true, data: [] },
  models: { loading: true, data: [] },
  uoms: { loading: true, data: [] },
  skuCodes: { loading: true, data: [] },
};

// fetch sku codes
const fetchSku = createAsyncThunk<SKUCode[]>("skuCodes", async () => {
  const res = await skuCodeApi.get();
  return res.data;
});

// fetch models
const fetchModels = createAsyncThunk("models", async () => {
  const res = await modelApi.get();
  return res.data;
});

// fetch items
const fetchItems = createAsyncThunk("items", async () => {
  const res = await itemApi.get();
  return res.data;
});

// fetch categories
const fetchCategories = createAsyncThunk<Category[]>("categories", async () => {
  const res = await categoryApi.get();
  return res.data;
});

// fetch branches
const fetchBranch = createAsyncThunk<Branch[], string>(
  "branches",
  async (search) => {
    const res = await branchApi.get(search);
    return res.data;
  }
);

// fetch uoms
const fetchUOMs = createAsyncThunk("uoms", async () => {
  const res = await uomApi.get();
  return res.data;
});

// create a slice
const utilsSlice = createSlice({
  name: "utils",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // sku codes
    builder
      .addCase(fetchSku.pending, (state) => ({
        ...state,
        skuCodes: { ...state.skuCodes, loading: true },
      }))
      .addCase(fetchSku.fulfilled, (state, action) => ({
        ...state,
        skuCodes: { data: action.payload, loading: false },
      }))
      .addCase(fetchSku.rejected, (state) => ({
        ...state,
        skuCodes: { data: [], loading: false },
      }));

    // categories
    builder
      .addCase(fetchCategories.pending, (state) => ({
        ...state,
        categories: { ...state.categories, loading: true },
      }))
      .addCase(fetchCategories.fulfilled, (state, action) => ({
        ...state,
        categories: { data: action.payload, loading: false },
      }))
      .addCase(fetchCategories.rejected, (state) => ({
        ...state,
        categories: { data: [], loading: false },
      }));

    // models
    builder
      .addCase(fetchModels.pending, (state) => ({
        ...state,
        models: { ...state.models, loading: true },
      }))
      .addCase(fetchModels.fulfilled, (state, action) => ({
        ...state,
        models: { data: action.payload, loading: false },
      }))
      .addCase(fetchModels.rejected, (state) => ({
        ...state,
        models: { data: [], loading: false },
      }));

    // items
    builder
      .addCase(fetchItems.pending, (state) => ({
        ...state,
        items: { ...state.items, loading: true },
      }))
      .addCase(fetchItems.fulfilled, (state, action) => ({
        ...state,
        items: { data: action.payload, loading: false },
      }))
      .addCase(fetchItems.rejected, (state) => ({
        ...state,
        items: { data: [], loading: false },
      }));

    // uoms
    builder
      .addCase(fetchUOMs.pending, (state) => ({
        ...state,
        uoms: { ...state.uoms, loading: true },
      }))
      .addCase(fetchUOMs.fulfilled, (state, action) => ({
        ...state,
        uoms: { data: action.payload, loading: false },
      }))
      .addCase(fetchUOMs.rejected, (state) => ({
        ...state,
        uoms: { data: [], loading: false },
      }));

    // branch
    builder
      .addCase(fetchBranch.pending, (state) => ({
        ...state,
        branches: { ...state.branches, loading: true },
      }))
      .addCase(fetchBranch.fulfilled, (state, action) => ({
        ...state,
        branches: { data: action.payload, loading: false },
      }))
      .addCase(fetchBranch.rejected, (state) => ({
        ...state,
        branches: { data: [], loading: false },
      }));
  },
});

// export reducer and async method
export {
  fetchBranch,
  fetchCategories,
  fetchItems,
  fetchModels,
  fetchSku,
  fetchUOMs,
};
export default utilsSlice.reducer;
