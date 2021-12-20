import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { baseUrlCoinGecko } from "../../app/api/api";
const initialState = {
  coin: [
    {
      aggregatorPrice: 0,
    },
  ],
  status: "idle",
  error: "none",
};
//
export const fetchCoin = createAsyncThunk(
  "coin/fetchCoin",
  async (priceObj) => {
    const { exchange, coinPair } = priceObj;
    const res = await axios.get(
      `/markets/${exchange}/${coinPair}/price`
      //baseUrlCoinGecko + `simple/price?ids=${coinId}&vs_currencies=usd`
    );
    return res.data.result;
  }
);

export const simplePriceSlice = createSlice({
  name: "coin",
  initialState,
  reducers: {
    aggregatePrice: (state, action) => {
      state.coin.aggregatorPrice = action.payload;
      console.log(action.payload);
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

export const { aggregatePrice } = simplePriceSlice.actions;
export default simplePriceSlice.reducer;
