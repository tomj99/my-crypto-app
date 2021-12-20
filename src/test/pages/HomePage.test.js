import { screen } from "@testing-library/react";
import React from "react";
import HomePage from "../../pages/homePage/HomePage";
import { renderMarketCapSliceTestComponent } from "../testUtil";

describe("HomePage", () => {
  const initialState = {
    coinsMCap: [],
    status: "idle",
    error: null,
  };
  const renderHomePage = (args) => {
    const defaultProps = {};
    const props = { ...defaultProps, ...args };
    return renderMarketCapSliceTestComponent(
      <HomePage {...props} />,
      initialState
    );
  };

  test("renders header", () => {
    renderHomePage();
    expect(screen.queryByText(/my crypto app/i)).toBeInTheDocument();
  });

  test("renders title", () => {
    renderHomePage();
    expect(screen.queryByText(/HomePage/)).toBeInTheDocument();
  });

  test("renders spinner", () => {
    renderHomePage();
    expect(screen.getByAltText(/Loading/i)).toBeInTheDocument();
  });
});
