import * as React from "react";
import { useRef } from "react";
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
  selectFilteredByUsd,
  selectCoin,
  selectCounter,
  selectCoinStatus,
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
import { fetchChartData } from "../../redux/slices/chart24HourSlice";
import { filterByUsd } from "../../redux/slices/marketsSlice";
import { fetchModifiableChartData } from "../../redux/slices/chartModifiableTimeSlice";
import {
  unixStartAndEndTimes23And24,
  convertDateToUnix,
} from "../timeUtils/timeUtils";
import ChartModal from "../modal/ChartModal";
import { Assignment } from "@material-ui/icons";

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
  const coinsAllSelector = useSelector(selectCoinsAll);
  const marketsSelector = useSelector(selectMarketsData);
  const usdPairsSelector = useSelector(selectFilteredByUsd);
  const coinSelector = useSelector(selectCoin);
  const countSelector = useSelector(selectCounter);
  const coinAggregatorSelector = useSelector(selectAggregatePrice);
  const dispatch = useDispatch();
  const [coinSymbol, setCoinSymbol] = React.useState("");
  const [coinList, setCoinList] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openModal, setOpenModal] = React.useState(false);
  const [coinText, setCoinText] = React.useState("");
  const [usdFilter, setUsdFilter] = React.useState(false);
  const [price, setPrice] = React.useState(0);
  const [priceList, setPriceList] = React.useState([]);

  React.useEffect(() => {
    if (coinSymbol !== "") {
      coinsAllSelector.map((result) => {
        if (result.symbol.toLowerCase().startsWith(coinSymbol.toLowerCase())) {
          // populate symbol list
          setCoinList((prevArray) => [...prevArray, result.symbol]);
        }
      });
    }
  }, [coinSymbol, coinsAllSelector]);

  React.useEffect(() => {
    if (coinSelector.price !== undefined) {
      setPriceList((prevArray) => [...prevArray, coinSelector]);
      if (coinAggregatorSelector === undefined) {
        setPrice("aggregating prices...");
      }
      if (coinAggregatorSelector !== undefined) {
        setPrice(coinAggregatorSelector);
      }
    }
  }, [coinSelector]);

  if (priceList.length === countSelector && countSelector !== 0) {
    console.log("count: ", countSelector);
    console.log("priceList: ", priceList);
    dispatch(aggregatePrice(aggregateMarketPrices()));
    clearLists();
  }

  function filterUsd() {
    let filteredByUsdPairs = [];
    marketsSelector.map((item) => {
      if (item.pair.endsWith("usd")) {
        filteredByUsdPairs.push(item);
      }
    });
    return filteredByUsdPairs;
  }

  if (marketsSelector !== undefined && usdFilter === false) {
    dispatch(filterByUsd(filterUsd()));
    setUsdFilter(true);
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

  function handleChange(Event) {
    setCoinList([]);
    setCoinSymbol(Event.target.value);
    setAnchorEl(Event.currentTarget);
    setOpen(true);
  }

  function clearLists() {
    dispatch(countReset());
    setPriceList([]);
  }

  function handleSearchOnEnter(Event) {
    if (Event.charCode === 13 && coinSymbol !== "") {
      coinList.map((coin) => {
        if (coin.toLowerCase() === coinSymbol.toLowerCase()) {
          const coinPricePair = coinSymbol.toLowerCase() + "usd";
          const markets = Object.values(usdPairsSelector);
          markets.forEach((item) => {
            if (item.pair === coinPricePair && item.active === true) {
              dispatch(increment());
              const coinObj = {
                exchange: item.exchange,
                coinPair: coinPricePair,
              };
              dispatch(fetchCoin(coinObj));
            }
          });
          setCoinText(coin);
          const chartInputObj = unixStartAndEndTimes23And24(coin, new Date());
          dispatch(fetchModifiableChartData(chartInputObj));
          setOpen(false);
          setCoinSymbol("");
          setOpenModal(true);
        }
      });
    }
  }

  function handleClick(Event) {
    const coinPricePair = Event.currentTarget.innerText + "usd";
    const markets = Object.values(usdPairsSelector);
    markets.forEach((item) => {
      if (item.pair === coinPricePair && item.active === true) {
        dispatch(increment());
        const coinObj = { exchange: item.exchange, coinPair: coinPricePair };
        dispatch(fetchCoin(coinObj));
      }
    });
    setCoinText(Event.currentTarget.innerText);
    const chartInputObj = unixStartAndEndTimes23And24(
      Event.currentTarget.innerText,
      new Date()
    );
    const startDate = convertDateToUnix(new Date());
    console.log("date: ", new Date());
    console.log("unix: ", startDate);
    // dispatch(fetchModifiableChartData(chartInputObj));
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

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
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
          <Search>
            <SearchIconWrapper>
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
          <Popper open={open} anchorEl={anchorEl} placement="bottom-end">
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
            />
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
