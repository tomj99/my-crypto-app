import React from "react";
import CoinList from "../../components/coinlist/CoinList";
import { screen } from "@testing-library/react";
import { renderTestComponent } from "../testUtil";

describe("CoinList", () => {
  const initialState = {
    coinsMCap: [],
    status: "idle",
    error: null,
  };
  const newState = {
    coinsMcap: {
      coinsMCap: [
        { id: "ethereum", name: "Ethereum", current_price: "4500" },
        { id: "bitcoin", name: "BTC", current_price: "100,000" },
      ],
      status: "succeeded",
      error: null,
    },
  };

  const renderCoinList = (args, testState) => {
    const defaultProps = {};
    const props = { ...defaultProps, ...args };
    return renderTestComponent(<CoinList {...props} />, testState);
  };

  test("renders spinner alt text", () => {
    renderCoinList();
    expect(screen.getByAltText(/Loading/i)).toBeInTheDocument();
  });

  test("renders coin list", () => {
    renderCoinList(null, newState);
    expect(screen.getByText(/Ethereum/i)).toBeInTheDocument();
    expect(screen.getByText(/BTC/i)).toBeInTheDocument();
  });
});
