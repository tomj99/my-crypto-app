import { screen } from "@testing-library/react";
import React from "react";
import HomePage from "../../pages/homePage/HomePage";
import { renderTestComponent } from "../testUtil";

describe("HomePage", () => {
  const initialState = {
    coinsAll: { coinsAll: [], status: "idle", error: null },
    markets: { markets: [], status: "idle", error: "none" },
  };

  const renderHomePage = (args) => {
    const defaultProps = {};
    const props = { ...defaultProps, ...args };
    return renderTestComponent(<HomePage {...props} />, initialState);
  };

  test("renders header text", () => {
    renderHomePage();
    expect(screen.getByText(/my crypto app/i)).toBeInTheDocument();
  });

  test("renders title", () => {
    renderHomePage();
    expect(screen.queryByText(/Coins - Top 50 by Volume/)).toBeInTheDocument();
  });

  test("renders spinner", () => {
    renderHomePage();
    expect(screen.getByAltText(/Loading/i)).toBeInTheDocument();
  });
});
