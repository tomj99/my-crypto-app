import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "@mui/material/Button";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Stack from "@mui/material/Stack";
import { ArrowDropDownCircleSharp } from "@material-ui/icons";
import {
  selectFilteredByUsd,
  selectCoinStatus,
  selectCoin,
  selectCurrentExchange,
} from "../../redux/selectors";
import { fetchCoin } from "../../redux/slices/simplePriceSlice";
import ChartModal from "../modal/ChartModal";
import {
  unixStartAndEndTimes,
  unixStartAndEndTimesLastCandle,
} from "../timeUtils/timeUtils";
import { saveExchange, isExchanges } from "../../redux/slices/marketsSlice";
import { useNavigate } from "react-router-dom";

const ExchangeMenu = (props) => {
  const usdPairsSelector = useSelector(selectFilteredByUsd);
  const coinStatusSelector = useSelector(selectCoinStatus);
  const coinSelector = useSelector(selectCoin);
  const currentExchangeSelector = useSelector(selectCurrentExchange);
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const anchorRef = React.useRef("exchange");
  const coinCurrencyPair = props.coin + "usd";
  const markets = Object.values(usdPairsSelector);
  const [openModal, setOpenModal] = React.useState(false);
  const [price, setPrice] = React.useState("");
  const [chartInputObject, setChartInputObject] = React.useState([]);
  const [chartInputObectLastCandle, setChartInputObjectLastCandle] =
    React.useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const buildChartApiInputObject = React.useCallback(() => {
    let startEndHours = {};
    const dateNow = new Date();
    startEndHours = unixStartAndEndTimes(dateNow);
    setChartInputObject({
      coin: coinCurrencyPair,
      startTime: startEndHours.startTime,
      endTime: startEndHours.endTime,
      period: 3600,
      exchange: currentExchangeSelector,
    });
  }, [coinCurrencyPair, currentExchangeSelector]);

  const buildChartApiInputObjectLastCandle = React.useCallback(() => {
    let startEndHours = {};
    const dateNow = new Date();
    startEndHours = unixStartAndEndTimesLastCandle(dateNow);
    setChartInputObjectLastCandle({
      coin: coinCurrencyPair,
      startTime: startEndHours.startTime,
      endTime: startEndHours.endTime,
      period: 60,
      exchange: currentExchangeSelector,
    });
  }, [coinCurrencyPair, currentExchangeSelector]);

  const exchangeAutoClick = React.useCallback(() => {
    anchorRef.current.click();
  }, [anchorRef]);

  React.useEffect(() => {
    if (coinStatusSelector === "idle") {
      exchangeAutoClick();
    }
  }, [exchangeAutoClick, coinStatusSelector]);

  React.useEffect(() => {
    if (coinStatusSelector === "succeeded") {
      setPrice(coinSelector.price);
      buildChartApiInputObject();
      buildChartApiInputObjectLastCandle();
      setOpen(false);
      setAnchorEl(null);
      setOpenModal(true);
    }
  }, [
    coinStatusSelector,
    coinSelector,
    buildChartApiInputObject,
    buildChartApiInputObjectLastCandle,
  ]);

  const handleExchangePopperClick = (Event) => {
    if (Event.currentTarget.innerText !== undefined) {
      const coinObj = {
        exchange: Event.currentTarget.innerText,
        coinPair: props.coin + "usd",
      };
      dispatch(fetchCoin(coinObj));
      dispatch(saveExchange(Event.currentTarget.innerText));
    }
  };

  const handleExchangeButtonClick = (Event) => {
    setOpen((open) => !open);
    setAnchorEl(Event.currentTarget);
  };

  const handleModalClick1 = () => {
    setOpenModal(false);
    dispatch(isExchanges(false));
    navigate("/chart");
  };

  const handleModalClick2 = () => {
    setOpenModal(false);
    dispatch(isExchanges(false));
    navigate("/portfolio");
  };

  const handleModalClick3 = () => {
    setOpenModal(false);
    dispatch(isExchanges(false));
  };

  // this is only called when open is set false
  const handleModalClose = () => setOpenModal(false);

  function handleClickAway() {
    setOpen(false);
    setAnchorEl(null);
  }

  // function handleListKeyDown(event) {
  //   if (event.key === "Tab") {
  //     event.preventDefault();
  //     setOpen(false);
  //   } else if (event.key === "Escape") {
  //     setOpen(false);
  //   }
  // }

  // return focus to the button when we transitioned from !open -> open
  //   const prevOpen = React.useRef(open);
  //   React.useEffect(() => {
  //     if (prevOpen.current === true && open === false) {
  //       anchorRef.current.focus();
  //     }

  //     prevOpen.current = open;
  //   }, [open]);

  return (
    <Stack direction="row" spacing={2}>
      <div>
        <Button
          name="exchange"
          id="exchange-button"
          onClick={handleExchangeButtonClick}
          ref={anchorRef}
          variant="contained"
          endIcon={<ArrowDropDownCircleSharp />}
        >
          Choose Exchange
        </Button>
        <Popper
          open={open}
          anchorEl={anchorEl}
          role={undefined}
          placement="bottom-end"
        >
          {/* {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === "bottom-start" ? "left top" : "left bottom",
              }}
            > */}
          <Paper>
            <ClickAwayListener onClickAway={handleClickAway}>
              <MenuList
                // autoFocusItem={open}
                id="composition-menu"
                aria-labelledby="exchange-button"
                // onKeyDown={handleListKeyDown}
              >
                {markets.map((item, index) => {
                  if (item.pair === coinCurrencyPair && item.active === true) {
                    return (
                      <MenuItem key={index} onClick={handleExchangePopperClick}>
                        {item.exchange}
                      </MenuItem>
                    );
                  }
                  return null;
                })}
              </MenuList>
            </ClickAwayListener>
          </Paper>

          {/* </Grow>
          )} */}
        </Popper>
        <Box>
          <ChartModal
            handleModalClick1={handleModalClick1}
            handleModalClick2={handleModalClick2}
            handleModalClick3={handleModalClick3}
            openModal={openModal}
            handleModalClose={handleModalClose}
            coinText={props.coin.toUpperCase()}
            price={price}
            chartInputObj={chartInputObject}
            chartInputObjLastCandle={chartInputObectLastCandle}
          />
        </Box>
      </div>
    </Stack>
  );
};

export default ExchangeMenu;
