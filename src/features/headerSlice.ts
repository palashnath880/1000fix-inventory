import { createSlice } from "@reduxjs/toolkit";

const initialState: { title: string; subtitle: string } = {
  title: "",
  subtitle: "",
};

export const headerSlice = createSlice({
  name: "headerSlice",
  initialState,
  reducers: {
    setHeader: (_, action) => action.payload,
  },
});

export const { setHeader } = headerSlice.actions;
export default headerSlice.reducer;
