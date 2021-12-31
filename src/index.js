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

store.dispatch(fetchAllCoins());
store.dispatch(fetchCoinsByMarketCap());
store.dispatch(fetchMarkets());

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
