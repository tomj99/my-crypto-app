import { jssPreset } from "@material-ui/core";
import { screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import MainHeader from "../../components/mainHeader/MainHeader";
import { renderTestComponent } from "../testUtil";

describe("MainHeader", () => {
  const initialState = {
    coinsAll: {
      coinsAll: [],
      status: "idle",
      error: null,
    },
  };

  const newState = {
    coinsAll: {
      coinsAll: [
        {
          fiat: false,
          id: 5478,
          name: "adatest",
          route: "https://api.cryptowat.ch/assets/ada",
          symbol: "adatest",
        },
      ],
      status: "succeeded",
      error: null,
    },
    markets: {
      markets: [
        {
          id: 1,
          exchange: "bitfinex",
          pair: "adatestusd",
          active: true,
          route: "https://api.cryptowat.ch/markets/bitfinex/ada",
        },
      ],
      status: "succeeded",
      error: "none",
    },
  };

  const renderHeader = (testState) => {
    const defaultProps = {};
    const props = { ...defaultProps };
    return renderTestComponent(<MainHeader {...props} />, testState);
  };

  // jest.mock("../../workers/coinList.worker.js");

  describe("main header rendering", () => {
    test("renders header text", () => {
      renderHeader();
      expect(screen.queryByText(/my crypto app/i)).toBeInTheDocument();
    });

    test("renders hamburger menu", () => {
      renderHeader();
      expect(screen.queryByLabelText(/open-drawer/)).toBeInTheDocument();
    });

    test("renders search bar", () => {
      renderHeader();
      expect(screen.getByTestId(/search-bar/)).toBeInTheDocument();
    });

    test("renders search placeholder text", () => {
      renderHeader();
      expect(screen.queryByPlaceholderText(/Search coin…/)).toBeInTheDocument();
    });

    test("renders search icon", () => {
      renderHeader();
      expect(screen.queryByLabelText(/search-icon/)).toBeInTheDocument();
    });
  });
  describe("main header actions", () => {
    test("renders search bar drop down when entering data", async () => {
      renderHeader(newState);
      const input = screen.getByPlaceholderText(/Search coin…/);
      // userEvent.click(input);
      userEvent.type(input, "a");
      expect(screen.queryByLabelText(/popper/)).toBeInTheDocument();
    });

    test("renders search bar drop down with correct item", async () => {
      renderHeader(newState);
      const input = screen.getByPlaceholderText(/Search coin…/);
      // userEvent.click(input);
      userEvent.type(input, "a");
      expect(screen.queryByText(/adatest/)).toBeInTheDocument();
    });

    test("renders modal when clicking search item", () => {
      renderHeader(newState);
      const input = screen.getByPlaceholderText(/Search coin…/);
      // userEvent.click(input);
      userEvent.type(input, "a");
      userEvent.click(screen.queryByText(/adatest/));
      expect(screen.queryByText(/coin: adatest/i)).toBeInTheDocument();
    });

    test("renders modal when hitting enter on valid search choice", () => {
      renderHeader(newState);
      const input = screen.getByPlaceholderText(/Search coin…/);
      // userEvent.click(input);
      userEvent.type(input, "adatest");
      expect(screen.queryByText(/coin: adatest/i)).toBeInTheDocument();
    });

    test("modal disappears upon button1 click", () => {
      renderHeader(newState);
      const input = screen.getByPlaceholderText(/Search coin…/);
      // userEvent.click(input);
      userEvent.type(input, "a");
      userEvent.click(screen.queryByText(/adatest/));
      userEvent.click(screen.queryByText(/show full chart/i));
      expect(screen.queryByText(/show full chart/i)).not.toBeInTheDocument();
    });

    test("modal disappears upon button2 click", () => {
      renderHeader(newState);
      const input = screen.getByPlaceholderText(/Search coin…/);
      // userEvent.click(input);
      userEvent.type(input, "a");
      userEvent.click(screen.queryByText(/adatest/));
      userEvent.click(screen.queryByText(/add to portfolio/i));
      expect(screen.queryByText(/add to portfolio/i)).not.toBeInTheDocument();
    });
  });
});
