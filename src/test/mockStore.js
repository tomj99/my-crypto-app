import axios from "axios";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  coinsAll: [],
  status: "idle",
  error: null,
};

export const mockSlice = createSlice({
  name: "mockData",
  initialState,
  reducers: {
    updateState: (state) => {
      return { ...state };
    },
  },
});
