import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
const initialState = {
  coin: [],
  status: "idle",
  error: "none",
};
//
export const fetchCoin = createAsyncThunk(
  "coin/fetchCoin",
  async (priceObj) => {
    const { exchange, coinPair } = priceObj;
    const res = await axios.get(`/markets/${exchange}/${coinPair}/price`);
    return res.data.result;
  }
);

export const simplePriceSlice = createSlice({
  name: "coin",
  initialState,
  reducers: {
    coinClear: (state) => {
      state.coin = [];
      state.status = "idle";
      state.error = "none";
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchCoin.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCoin.fulfilled, (state, action) => {
        state.coin = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchCoin.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { coinClear } = simplePriceSlice.actions;
export default simplePriceSlice.reducer;
