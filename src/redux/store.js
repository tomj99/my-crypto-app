import { configureStore } from "@reduxjs/toolkit";
// import used for combining reducers
import reducer from "./rootReducer";
// import used for a single reducer
// import CoinsAllReducer from "../redux/slices/coinsAllSlice";

// used for combining reducers
const store = configureStore({ reducer });
export default store;

// used for a single reducer
// const store = configureStore({
//   reducer: {
//     coinsAll: CoinsAllReducer,
//   },
// });
// export default store;
