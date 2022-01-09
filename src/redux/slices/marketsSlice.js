import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  markets: [
    {
      currentExchange: "",
    },
  ],
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
    updateMarketsState: (state, action) => {
      Object.assign(state, action.payload);
    },
    filterByUsd: (state, action) => {
      state.markets = action.payload;
      //Object.assign(state.markets, action.payload);
    },
    saveExchange: (state, action) => {
      state.markets.currentExchange = action.payload;
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

export const { filterByUsd, updateMarketsState, saveExchange } =
  marketsSlice.actions;
export default marketsSlice.reducer;
