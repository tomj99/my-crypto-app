import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  markets: [],
  status: "idle",
  error: "none",
};

export const fetchMarkets = createAsyncThunk(
  "markets/fetchMarkets",
  async () => {
    const res = await axios.get(`/markets`);
    return res.data;
  }
);

export const marketsSlice = createSlice({
  name: "markets",
  initialState,
  reducers: {
    filterByUsd: (state, action) => {
      state.markets = action.payload;
      //Object.assign(state.markets, action.payload);
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchMarkets.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMarkets.fulfilled, (state, action) => {
        state.markets = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchMarkets.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { filterByUsd } = marketsSlice.actions;
export default marketsSlice.reducer;
