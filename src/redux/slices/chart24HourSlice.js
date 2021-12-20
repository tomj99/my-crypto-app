import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  chartData: [],
  status: "idle",
  error: null,
};

// https://api.coingecko.com/api/v3/coins/bitcoin/market_chart/range?vs_currency=usd&from=1638501223.317&to=1638587623.317

// https://api.polygon.io/v2/aggs/ticker/X:BTCUSD/range/1/hour/2021-07-22/2021-07-22?adjusted=true&sort=asc&limit=120&apiKey=l454beRcRe0OxlWqInTUGb1LXj_HDfUS

export const fetchChartData = createAsyncThunk(
  "chartData/fetchChartData",
  async (chartInputs) => {
    const { coin, startTime, endTime } = chartInputs;
    const res = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${coin}/market_chart/range?vs_currency=usd&from=${startTime}&to=${endTime}`
    );
    return res.data;
  }
);

export const chart24HourSlice = createSlice({
  name: "chartData",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchChartData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchChartData.fulfilled, (state, action) => {
        state.chartData = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchChartData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default chart24HourSlice.reducer;
