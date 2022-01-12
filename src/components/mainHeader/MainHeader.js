import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCoinsAll,
  selectMarketsData,
  selectMarketsStatus,
  selectIsExchanges,
} from "../../redux/selectors";
import SearchItem from "../searchItem/SearchItem";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import List from "@mui/material/List";
import { filterByUsd, isExchanges } from "../../redux/slices/marketsSlice";
import ExchangeMenu from "../exchangeMenu/ExchangeMenu";
import { coinClear } from "../../redux/slices/simplePriceSlice";
// import WorkerBuilder from "../../workers/worker-builder";
// import CoinListWorker from "../../workers/coinList.worker";
// const instance = new WorkerBuilder(CoinListWorker);

// styled component section
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

export default function MainHeader() {
  const dispatch = useDispatch();
  // selectors
  const coinsAllSelector = useSelector(selectCoinsAll);
  const marketsSelector = useSelector(selectMarketsData);
  const marketsStatusSelector = useSelector(selectMarketsStatus);
  const isExchangesSelector = useSelector(selectIsExchanges);
  // hooks
  const [coinSymbol, setCoinSymbol] = React.useState("");
  const [coinList, setCoinList] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [usdFilter, setUsdFilter] = React.useState(false);
  // const [isExchanges, setIsExchanges] = React.useState(false);
  const [coin, setCoin] = React.useState("");
  // SECTION useEffects
  // *Without webworker*, tests pass

  // Called when search bar is being populated
  React.useEffect(() => {
    if (coinSymbol !== "") {
      coinsAllSelector.forEach((result) => {
        if (result.symbol.toLowerCase().startsWith(coinSymbol.toLowerCase())) {
          // populate symbol list
          setCoinList((prevArray) => [...prevArray, result.symbol]);
        }
      });
    }
  }, [coinSymbol, coinsAllSelector]);

  // *With webworker*, tests fail
  // React.useEffect(() => {
  //   if (coinsAllStatusSelector === "succeeded") {
  //     if (coinSymbol !== "") {
  //       instance.onmessage = (message) => {
  //         if (message) {
  //           setCoinList(message.data);
  //         }
  //       };
  //     }
  //   }
  // }, [coinSymbol, coinsAllStatusSelector]);

  if (marketsSelector !== undefined && usdFilter === false) {
    dispatch(filterByUsd(filterUsd()));
    setUsdFilter(true);
  }

  // SECTION dispatched functions
  function filterUsd() {
    let filteredByUsdPairs = [];
    marketsSelector.forEach((item) => {
      if (item.pair.endsWith("usd")) {
        filteredByUsdPairs.push(item);
      }
    });
    return filteredByUsdPairs;
  }

  // SECTION handlers
  function handleChange(Event) {
    // const symbol = Event.target.value; // for webworker
    // instance.postMessage({ args: [symbol, coinsAllSelector] }); // for webworker
    setCoinList([]);
    setCoinSymbol(Event.target.value);
    setAnchorEl(Event.currentTarget);
    setOpen(true);
  }

  function handleSearchOnEnter(Event) {
    if (Event.charCode === 13 && coinSymbol !== "") {
      dispatch(isExchanges(true));
      dispatch(coinClear());
      // setIsExchanges(true);
      setCoin(coinSymbol);
    }
  }

  function handleClick(Event) {
    dispatch(isExchanges(true));
    dispatch(coinClear());
    setCoin("adatest");
    if (Event.currentTarget.innerText !== undefined) {
      setCoin(Event.currentTarget.innerText);
    }
  }

  function handleClickAway() {
    setOpen(false);
    setAnchorEl(null);
    setCoinSymbol("");
  }

  // SECTION misc functions

  const ExchangeButton = () => {
    // const isExchanges = props.isExchanges;
    if (isExchangesSelector && marketsStatusSelector === "succeeded") {
      return <ExchangeMenu coin={coin} />;
    }
    return null;
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open-drawer"
            sx={{ mr: 2 }}
          >
            <MenuRoundedIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
          >
            My Crypto App
          </Typography>
          <ExchangeButton />
          <Search hidden={isExchangesSelector} data-testid="search-bar">
            <SearchIconWrapper aria-label="search-icon">
              <SearchRoundedIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search coin…"
              inputProps={{ "aria-label": "search" }}
              onChange={handleChange}
              onKeyPress={handleSearchOnEnter}
              value={coinSymbol}
            ></StyledInputBase>
          </Search>

          <Popper
            aria-label="popper"
            open={open}
            anchorEl={anchorEl}
            placement="bottom-end"
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClickAway}>
                <List>
                  {coinList.map((listItem, index) => (
                    <SearchItem
                      key={index}
                      listText={listItem}
                      handleClick={handleClick}
                    />
                  ))}
                </List>
              </ClickAwayListener>
            </Paper>
          </Popper>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
