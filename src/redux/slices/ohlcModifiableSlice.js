import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  ohlcModifiable: [],
  status: "idle",
  error: null,
};

export const fetchOhlcModifiableData = createAsyncThunk(
  "ohlcModifiable/fetchOhlcDataModifiable",
  async (chartInputModObj) => {
    const { coin, startTime, endTime, period, exchange } = chartInputModObj;
    const res = await axios.get(
      `/markets/${exchange}/${coin}/ohlc?before=${endTime}&after=${startTime}&periods=${period}`
    );
    return res.data.result;
  }
);

export const ohlcModifiableSlice = createSlice({
  name: "ohlcModifiable",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchOhlcModifiableData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchOhlcModifiableData.fulfilled, (state, action) => {
        state.ohlcModifiable = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchOhlcModifiableData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default ohlcModifiableSlice.reducer;
