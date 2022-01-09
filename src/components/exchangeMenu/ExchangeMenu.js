import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "@mui/material/Button";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Box from "@mui/material/Box";
import Grow from "@mui/material/Grow";
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
} from "../../redux/selectors";
import { fetchCoin } from "../../redux/slices/simplePriceSlice";
import ChartModal from "../modal/ChartModal";
import {
  unixStartAndEndTimes,
  unixStartAndEndTimesLastCandle,
} from "../timeUtils/timeUtils";
import { SystemSecurityUpdate } from "@mui/icons-material";

const ExchangeMenu = (props) => {
  const usdPairsSelector = useSelector(selectFilteredByUsd);
  const coinStatusSelector = useSelector(selectCoinStatus);
  const coinSelector = useSelector(selectCoin);
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const anchorRef = React.useRef("exchange");
  const coinCurrencyPair = props.coin + "usd";
  const markets = Object.values(usdPairsSelector);
  const [openModal, setOpenModal] = React.useState(false);
  const [exchangeName, setExchangeName] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [chartInputObject, setChartInputObject] = React.useState([]);
  const [chartInputObectLastCandle, setChartInputObjectLastCandle] =
    React.useState([]);

  const buildChartApiInputObject = React.useCallback(() => {
    let startEndHours = {};
    const dateNow = new Date();
    startEndHours = unixStartAndEndTimes(dateNow);
    setChartInputObject({
      coin: coinCurrencyPair,
      startTime: startEndHours.startTime,
      endTime: startEndHours.endTime,
      period: 3600,
      exchange: exchangeName,
    });
  }, [coinCurrencyPair, exchangeName]);

  const buildChartApiInputObjectLastCandle = React.useCallback(() => {
    let startEndHours = {};
    const dateNow = new Date();
    startEndHours = unixStartAndEndTimesLastCandle(dateNow);
    setChartInputObjectLastCandle({
      coin: coinCurrencyPair,
      startTime: startEndHours.startTime,
      endTime: startEndHours.endTime,
      period: 60,
      exchange: exchangeName,
    });
  }, [coinCurrencyPair, exchangeName]);

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
      console.log(coinSelector.price);
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
      setExchangeName(Event.currentTarget.innerText);
    }
  };

  const handleExchangeButtonClick = (Event) => {
    setOpen((open) => !open);
    setAnchorEl(Event.currentTarget);
    console.log("button clicked");
  };

  const handleModalClick1 = () => {
    // setIsExchanges(false);
    setOpenModal(false);
    // clearLists();
  };

  const handleModalClick2 = () => {
    // setIsExchanges(false);
    setOpenModal(false);
    // clearLists();
  };

  // this is only called when open is set false
  const handleModalClose = () => setOpenModal(false);

  //     setOpen(false);
  //   };

  //   function handleListKeyDown(event) {
  //     if (event.key === "Tab") {
  //       event.preventDefault();
  //       setOpen(false);
  //     } else if (event.key === "Escape") {
  //       setOpen(false);
  //     }
  //   }

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
          // transition
          // disablePortal
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
            <ClickAwayListener onClickAway={handleExchangePopperClick}>
              <MenuList
                autoFocusItem={open}
                id="composition-menu"
                aria-labelledby="exchange-button"
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
