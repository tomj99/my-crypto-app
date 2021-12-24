import React from "react";
import { render as rtlRender } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import ohlcReducer from "../redux/slices/ohlcSlice";
import counterReducer from "../redux/slices/counterSlice";
import chartModifiableTimeReducer from "../redux/slices/chartModifiableTimeSlice";
import chart24HourReducer from "../redux/slices/chart24HourSlice";
import simplePriceReducer from "../redux/slices/simplePriceSlice";
import marketsReducer, {
  updateMarketsState,
} from "../redux/slices/marketsSlice";
import coinsAllReducer, {
  updateAllCoinState,
} from "../redux/slices/coinsAllSlice";
import marketCapReducer, {
  updateCoinsMcapState,
} from "../redux/slices/marketCapSlice";

function renderTestComponent(ui, testState) {
  const store = configureStore({
    reducer: {
      coinsAll: coinsAllReducer,
      coinsByMarketCap: marketCapReducer,
      coin: simplePriceReducer,
      chartData: chart24HourReducer,
      modifiableChartData: chartModifiableTimeReducer,
      markets: marketsReducer,
      counter: counterReducer,
      ohlc: ohlcReducer,
    },
  });
  // any dispatching of new test states can be done here
  if (testState !== undefined) {
    if (testState.coinsAll !== undefined) {
      store.dispatch(updateAllCoinState(testState.coinsAll));
    }
    if (testState.coinsMcap !== undefined) {
      store.dispatch(updateCoinsMcapState(testState.coinsMcap));
    }
    if (testState.markets !== undefined) {
      store.dispatch(updateMarketsState(testState.markets));
    }
  }

  // store.dispatch(updateAllCoinState(testState));
  const wrapper = ({ children }) => {
    return <Provider store={store}>{children}</Provider>;
  };
  return rtlRender(ui, { wrapper });
}

// re-export everything
export * from "@testing-library/react";
// override render method
export { renderTestComponent };
