import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import store from "../src/redux/store";
import { Provider } from "react-redux";
import * as serviceWorker from "./serviceWorker";
import { fetchCoinsByMarketCap } from "./redux/slices/marketCapSlice";
import { fetchAllCoins } from "./redux/slices/coinsAllSlice";
import { fetchMarkets } from "./redux/slices/marketsSlice";
import { fetchOhlcData } from "./redux/slices/ohlcSlice";
import { fetchCoin } from "./redux/slices/simplePriceSlice";
import { fetchModifiableChartData } from "./redux/slices/chartModifiableTimeSlice";
import {
  convertDateToUnix,
  convertUnixToDate,
} from "./components/timeUtils/timeUtils";

store.dispatch(fetchAllCoins());
store.dispatch(fetchCoinsByMarketCap());
store.dispatch(fetchMarkets());
// store.dispatch(fetchOhlcData());

// new Date format: "Sat Dec 04 2021 00:00:00"

// // test, remove later
// const chartInputObj = {
//   symbol: "X:BTCUSD",
//   startTime: startDate,
//   endTime: endDate,
//   multiplier: 1,
//   timespan: "hour",
//   limit: 1440,
// };
// store.dispatch(fetchModifiableChartData(chartInputObj));

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
