// redux reducer is similar to the reducer setup in the context api
import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { coinGecko } from "../../api/urlList";
const initialState = {
  coinsMCap: [],
  status: "idle",
  error: null,
};

export const fetchCoinsByMarketCap = createAsyncThunk(
  "coinsByMarketCap/fetchCoinsByMarketCap",
  async () => {
    const res = await coinGecko.get(
      `/coins/markets/?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false`
    );
    return res.data;
  }
);

export const marketCapSlice = createSlice({
  name: "coinsByMarketCap",
  initialState,
  reducers: {
    updateCoinsMcapState: (state, action) => {
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

export const { updateCoinsMcapState } = marketCapSlice.actions;
export default marketCapSlice.reducer;
