import { combineReducers } from "redux";
import coinsAllReducer from "./slices/coinsAllSlice";
import marketCapReducer from "./slices/marketCapSlice";
import simplePriceReducer from "./slices/simplePriceSlice";
import chart24HourReducer from "./slices/chart24HourSlice";
import chartModifiableTimeReducer from "./slices/chartModifiableTimeSlice";
import marketsReducer from "./slices/marketsSlice";
import counterReducer from "./slices/counterSlice";
import ohlcReducer from "./slices/ohlcSlice";

const reducer = combineReducers({
  coinsAll: coinsAllReducer,
  coinsByMarketCap: marketCapReducer,
  coin: simplePriceReducer,
  chartData: chart24HourReducer,
  modifiableChartData: chartModifiableTimeReducer,
  markets: marketsReducer,
  counter: counterReducer,
  ohlc: ohlcReducer,
});

export default reducer;
