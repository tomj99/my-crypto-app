import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  modifiableChartData: [],
  status: "idle",
  error: null,
};

// https://api.polygon.io/v2/aggs/ticker/X:BTCUSD/range/1/hour/2021-07-22/2021-07-22?adjusted=true&sort=asc&limit=120&apiKey=l454beRcRe0OxlWqInTUGb1LXj_HDfUS

export const fetchModifiableChartData = createAsyncThunk(
  "modifiableChartData/fetchModifiableChartData",
  async (chartInputs) => {
    const { symbol, startTime, endTime, multiplier, timespan, limit } =
      chartInputs;
    const res = await axios.get(
      `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/${multiplier}/${timespan}/${startTime}/${endTime}?adjusted=true&sort=asc&limit=${limit}&apiKey=l454beRcRe0OxlWqInTUGb1LXj_HDfUS`
    );
    return res.data;
  }
);

export const chartModifiableTimeSlice = createSlice({
  name: "modifiableChartData",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchModifiableChartData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchModifiableChartData.fulfilled, (state, action) => {
        state.modifiableChartData = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchModifiableChartData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default chartModifiableTimeSlice.reducer;
