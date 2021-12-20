// redux reducer is similar to the reducer setup in the context api
import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  coinsMCap: [],
  status: "idle",
  error: null,
};

export const fetchCoinsByMarketCap = createAsyncThunk(
  "coinsByMarketCap/fetchCoinsByMarketCap",
  async () => {
    const res = await axios.get(
      `https://api.coingecko.com/api/v3/coins/markets/?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false`
    );
    return res.data;
  }
);

export const marketCapSlice = createSlice({
  name: "coinsByMarketCap",
  initialState,
  reducers: {
    updateCoinState: (state, action) => {
      Object.assign(state, action.payload);
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchCoinsByMarketCap.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCoinsByMarketCap.fulfilled, (state, action) => {
        state.coinsMCap = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchCoinsByMarketCap.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { updateCoinState } = marketCapSlice.actions;
export default marketCapSlice.reducer;
