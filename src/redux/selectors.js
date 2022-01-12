// coinsAllSlice selectors
export const selectCoinsAll = (state) => state.coinsAll.coinsAll;
export const selectCoinsAllStatus = (state) => state.coinsAll.status;
export const selectCoinsAllError = (state) => state.coinsAll.error;

// marketCapSlice selectors
export const selectCoinsMCap = (state) => state.coinsByMarketCap.coinsMCap;
export const selectCoinsMCapStatus = (state) => state.coinsByMarketCap.status;
export const selectCoinsMCapError = (state) => state.coinsByMarketCap.error;

// coinSlice selectors
export const selectCoin = (state) => state.coin.coin;
export const selectCoinStatus = (state) => state.coin.status;
export const selectCoinError = (state) => state.coin.error;
export const selectAggregatePrice = (state) => state.coin.coin.aggregatorPrice;

// chartData selectors
export const selectChartData = (state) => state.chartData.chartData;
export const selectChartStatus = (state) => state.chartData.status;
export const selectChartError = (state) => state.chartData.error;

// markets selectors
export const selectMarketsData = (state) => state.markets.markets.result;
export const selectMarketsStatus = (state) => state.markets.status;
export const selectMarketsError = (state) => state.markets.error;
export const selectFilteredByUsd = (state) => state.markets.markets;
export const selectCurrentExchange = (state) => state.markets.currentExchange;
export const selectIsExchanges = (state) => state.markets.isExchanges;

// counter selector
export const selectCounter = (state) => state.counter.value;

// ohlc selectors
export const selectOhlcData = (state) => state.ohlc.ohlc;
export const selectOhlcStatus = (state) => state.ohlc.status;
export const selectOhlcError = (state) => state.ohlc.error;

//ohlcModifiable selectors
export const selectOhlcModifiableData = (state) =>
  state.ohlcModifiable.ohlcModifiable;
export const selectOhlcModifiableStatus = (state) =>
  state.ohlcModifiable.status;
export const selectOhlcModifiableError = (state) => state.ohlcModifiable.error;
