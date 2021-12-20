import React from "react";
import { render as rtlRender } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import marketCapReducer, {
  updateCoinState,
} from "../redux/slices/marketCapSlice";

function renderMarketCapSliceTestComponent(ui, testState) {
  const store = configureStore({
    reducer: { coinsByMarketCap: marketCapReducer },
  });
  store.dispatch(updateCoinState(testState));
  const wrapper = ({ children }) => {
    return <Provider store={store}>{children}</Provider>;
  };
  return rtlRender(ui, { wrapper });
}

// re-export everything
export * from "@testing-library/react";
// override render method
export { renderMarketCapSliceTestComponent };
