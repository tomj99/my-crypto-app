import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  ohlc: [],
  status: "idle",
  error: null,
};

export const fetchOhlcData = createAsyncThunk(
  "ohlc/fetchOhlcData",
  async () => {
    const res = await axios.get(`/markets/kraken/btcusd/ohlc`);
    return res.data.result;
  }
);

export const ohlcSlice = createSlice({
  name: "ohlc",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchOhlcData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchOhlcData.fulfilled, (state, action) => {
        state.ohlc = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchOhlcData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default ohlcSlice.reducer;
