import React from "react";
import { useSelector } from "react-redux";
import Spinner from "../spinner/Spinner";
import {
  selectCoinsMCap,
  selectCoinsMCapStatus,
  selectCoinsMCapError,
} from "../../redux/selectors";

const CoinList = () => {
  const coinsMCapSelector = useSelector(selectCoinsMCap);
  const coinsMCapStatusSelector = useSelector(selectCoinsMCapStatus);
  const coinsMCapErrorMessageSelector = useSelector(selectCoinsMCapError);
  let coinNumber = 1;

  if (
    coinsMCapStatusSelector === "loading" ||
    coinsMCapStatusSelector === "idle"
  ) {
    return (
      <div>
        <Spinner />
      </div>
    );
  } else if (coinsMCapStatusSelector === "succeeded") {
    return (
      <div>
        {coinsMCapSelector.map((coinsMCap) => (
          <h4 key={coinsMCap.id}>
            #{coinNumber++}, Coin: {coinsMCap.name}, Price:{" "}
            {coinsMCap.current_price}
          </h4>
        ))}
      </div>
    );
  } else if (coinsMCapStatusSelector === "failed") {
    return (
      <div>
        <h1>{coinsMCapErrorMessageSelector}</h1>
      </div>
    );
  }
};

export default CoinList;
