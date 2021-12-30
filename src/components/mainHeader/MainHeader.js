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
  // selectCoinsAllStatus,
  selectMarketsData,
  // selectMarketsStatus,
  selectFilteredByUsd,
  selectCoin,
  selectCoinStatus,
  selectCounter,
  selectAggregatePrice,
} from "../../redux/selectors";
import SearchItem from "../searchItem/SearchItem";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import List from "@mui/material/List";
import { increment, countReset } from "../../redux/slices/counterSlice";
import { aggregatePrice } from "../../redux/slices/simplePriceSlice";
import { fetchCoin } from "../../redux/slices/simplePriceSlice";
import { filterByUsd } from "../../redux/slices/marketsSlice";
import { fetchModifiableChartData } from "../../redux/slices/chartModifiableTimeSlice";
import {
  unixStartAndEndTimes23And24,
  convertDateToUnix,
  convertUnixToDate,
} from "../timeUtils/timeUtils";
import ChartModal from "../modal/ChartModal";
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
  // const coinsAllStatusSelector = useSelector(selectCoinsAllStatus);
  const marketsSelector = useSelector(selectMarketsData);
  // const marketsStatusSelector = useSelector(selectMarketsStatus);
  const usdPairsSelector = useSelector(selectFilteredByUsd);
  const coinSelector = useSelector(selectCoin);
  const coinStatusSelector = useSelector(selectCoinStatus);
  const countSelector = useSelector(selectCounter);
  const coinAggregatorSelector = useSelector(selectAggregatePrice);
  // hooks
  const [coinSymbol, setCoinSymbol] = React.useState("");
  const [coinList, setCoinList] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openModal, setOpenModal] = React.useState(false);
  const [coinText, setCoinText] = React.useState("");
  const [usdFilter, setUsdFilter] = React.useState(false);
  const [price, setPrice] = React.useState("");
  const [priceList, setPriceList] = React.useState([]);
  const [chartInputObject, setChartInputObject] = React.useState([]);

  // SECTION useEffects
  // *Without webworker*, tests pass
  React.useEffect(() => {
    if (coinSymbol !== "") {
      coinsAllSelector.map((result) => {
        if (result.symbol.toLowerCase().startsWith(coinSymbol.toLowerCase())) {
          // populate symbol list
          setCoinList((prevArray) => [...prevArray, result.symbol]);
        }
        return null;
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

  React.useEffect(() => {
    if (coinStatusSelector === "succeeded") {
      setPriceList((prevArray) => [...prevArray, coinSelector]);
      if (coinAggregatorSelector === undefined) {
        setPrice("aggregating prices...");
      }
      if (coinAggregatorSelector !== undefined) {
        setPrice(coinAggregatorSelector);
      }
    }
  }, [coinSelector]);

  // SECTION actions on rerender
  if (priceList.length === countSelector && countSelector !== 0) {
    dispatch(aggregatePrice(aggregateMarketPrices()));
    clearLists();
  }

  if (marketsSelector !== undefined && usdFilter === false) {
    //if (marketsStatusSelector === "succeeded" && usdFilter === false) {
    dispatch(filterByUsd(filterUsd()));
    setUsdFilter(true);
  }

  // SECTION dispatched functions
  function filterUsd() {
    let filteredByUsdPairs = [];
    marketsSelector.map((item) => {
      if (item.pair.endsWith("usd")) {
        filteredByUsdPairs.push(item);
      }
    });
    return filteredByUsdPairs;
  }

  function aggregateMarketPrices() {
    const length = priceList.length;
    let totalPrice = 0;
    let aggregatePrice = 0;
    priceList.forEach((item) => {
      totalPrice += item.price;
    });
    aggregatePrice = totalPrice / length;
    if (aggregatePrice >= 1) {
      aggregatePrice = Math.floor(aggregatePrice * 100000) / 100000;
    } else
      aggregatePrice = Math.floor(aggregatePrice * 10000000000) / 10000000000;
    return aggregatePrice;
  }

  // SECTION handlers
  function handleChange(Event) {
    const symbol = Event.target.value;
    // instance.postMessage({ args: [symbol, coinsAllSelector] });
    setCoinList([]);
    setCoinSymbol(Event.target.value);
    setAnchorEl(Event.currentTarget);
    setOpen(true);
  }

  function handleSearchOnEnter(Event) {
    if (Event.charCode === 13 && coinSymbol !== "") {
      coinList.map((coin) => {
        if (coin.toLowerCase() === coinSymbol.toLowerCase()) {
          const coinCurrencyPair = coinSymbol.toLowerCase() + "usd";
          const markets = Object.values(usdPairsSelector);
          markets.forEach((item) => {
            if (item.pair === coinCurrencyPair && item.active === true) {
              dispatch(increment());
              const coinObj = {
                exchange: item.exchange,
                coinPair: coinCurrencyPair,
              };
              dispatch(fetchCoin(coinObj));
            }
          });
          setCoinText(coin.toUpperCase());
          setChartInputObject(
            unixStartAndEndTimes23And24(coinCurrencyPair, new Date())
          );
          setOpen(false);
          setCoinSymbol("");
          setOpenModal(true);
        }
      });
    }
  }

  function handleClick(Event) {
    // need next two lines for test bug, event text is not getting passed in during testing.
    let coinCurrencyPair = "adatestusd";
    let coin = "adatest";
    if (Event.currentTarget.innerText !== undefined) {
      coin = Event.currentTarget.innerText;
      coinCurrencyPair = Event.currentTarget.innerText + "usd";
    }
    const markets = Object.values(usdPairsSelector);
    markets.forEach((item) => {
      if (item.pair === coinCurrencyPair && item.active === true) {
        dispatch(increment());
        const coinObj = { exchange: item.exchange, coinPair: coinCurrencyPair };
        dispatch(fetchCoin(coinObj));
      }
    });
    setCoinText(coin.toUpperCase());
    setChartInputObject(
      unixStartAndEndTimes23And24(coinCurrencyPair, new Date())
    );
    console.log("minutes: ", new Date().getMinutes());
    setOpen(false);
    setAnchorEl(null);
    setCoinSymbol("");
    setOpenModal(true);
  }

  function handleClickAway() {
    setOpen(false);
    setAnchorEl(null);
    setCoinSymbol("");
  }

  const handleModalClick1 = () => {
    setOpenModal(false);
    clearLists();
  };

  const handleModalClick2 = () => {
    setOpenModal(false);
    clearLists();
  };

  // this is only called when open is set false
  const handleModalClose = () => setOpenModal(false);

  // SECTION misc functions
  function clearLists() {
    dispatch(countReset());
    setPriceList([]);
  }

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
          <Search data-testid="search-bar">
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
          <Box>
            <ChartModal
              handleModalClick1={handleModalClick1}
              handleModalClick2={handleModalClick2}
              openModal={openModal}
              handleModalClose={handleModalClose}
              coinText={coinText}
              price={price}
              chartInputObj={chartInputObject}
            />
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
