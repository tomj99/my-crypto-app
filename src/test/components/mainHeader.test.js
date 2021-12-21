import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import MainHeader from "../../components/mainHeader/MainHeader";
import { renderTestComponent } from "../testUtil";

describe("MainHeader", () => {
  const initialState = {
    coinsAll: ["ada", "eth", "btc"],
    status: "idle",
    error: null,
  };

  const renderHeader = (args) => {
    const defaultProps = {};
    const props = { ...defaultProps, ...args };
    return renderTestComponent(<MainHeader {...props} />, initialState);
  };

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
  //   describe("main header actions", () => {
  //     test("renders search bar drop down when entering data", () => {
  //       renderHeader();
  //       const input = screen.getByPlaceholderText(/Search coin…/);
  //       userEvent.click(input);
  //       userEvent.type(input, "ada");
  //       expect(screen.getByLabelText.)
  //     });
  //   });
});
