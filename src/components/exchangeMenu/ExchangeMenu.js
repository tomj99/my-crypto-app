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
import { selectFilteredByUsd } from "../../redux/selectors";
import ChartModal from "../modal/ChartModal";

const ExchangeMenu = (props) => {
  const usdPairsSelector = useSelector(selectFilteredByUsd);
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const anchorRef = React.useRef("exchange");
  const coinCurrencyPair = props.coin + "usd";
  const markets = Object.values(usdPairsSelector);

  const clickIt = React.useCallback(() => {
    anchorRef.current.click();
  }, [anchorRef]);

  React.useEffect(() => {
    clickIt();
  }, [clickIt]);

  const handleClose = (event) => {
    // if (anchorRef.current && anchorRef.current.contains(event.target)) {
    //   return;
    // }

    setOpen(false);
  };

  const exchange = (item, index) => {
    return (
      <MenuItem key={index} onClick={handleDispatchAndClose}>
        {item}
      </MenuItem>
    );
  };

  // const buildChartApiInputObject = () => {
  //   let startEndHours = {};
  //   const dateNow = new Date();
  //   setCoinText(props.coin.toUpperCase());
  //   startEndHours = unixStartAndEndTimes(dateNow);
  //   setChartInputObject({
  //     coin: coinCurrencyPair,
  //     startTime: startEndHours.startTime,
  //     endTime: startEndHours.endTime,
  //     period: 3600,
  //     exchange: exchange,
  //   });
  //   startEndHours = unixStartAndEndTimesLastCandle(dateNow);
  //   setChartInputObjectLastCandle({
  //     coin: coinCurrencyPair,
  //     startTime: startEndHours.startTime,
  //     endTime: startEndHours.endTime,
  //     period: 60,
  //     exchange: exchange,
  //   });
  //   setOpen(false);
  //   setAnchorEl(null);
  //   setCoinSymbol("");
  //   setOpenModal(true);
  // };

  const handleDispatchAndClose = (exchange) => {
    const coinObj = { exchange: exchange, coinPair: props.coin + "usd" };
    // dispatch(fetchCoin(coinObj));
    setOpen(false);
  };

  const handleExchangeClick = (Event) => {
    setOpen(true);
    setAnchorEl(Event.currentTarget);
    console.log("button clicked");
  };

  const handleModalClick1 = () => {
    // setIsExchanges(false);
    // setOpenModal(false);
    // clearLists();
  };

  const handleModalClick2 = () => {
    // setIsExchanges(false);
    // setOpenModal(false);
    // clearLists();
  };

  // this is only called when open is set false
  //const handleModalClose = () => setOpenModal(false);

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
          onClick={handleExchangeClick}
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
            <ClickAwayListener onClickAway={handleClose}>
              <MenuList
                autoFocusItem={open}
                id="composition-menu"
                aria-labelledby="exchange-button"
              >
                {markets.map((item, index) => {
                  if (item.pair === coinCurrencyPair && item.active === true) {
                    return (
                      <MenuItem key={index} onClick={handleClose}>
                        {item.exchange}
                      </MenuItem>
                    );
                  }
                })}
              </MenuList>
            </ClickAwayListener>
          </Paper>
          <Box>
            {/* <ChartModal
                  handleModalClick1={handleModalClick1}
                  handleModalClick2={handleModalClick2}
                  openModal={openModal}
                  handleModalClose={handleModalClose}
                  coinText={coinText}
                  price={price}
                  chartInputObj={chartInputObject}
                  chartInputObjLastCandle={chartInputObectLastCandle}
                /> */}
          </Box>
          {/* </Grow> */}
        </Popper>
      </div>
    </Stack>
  );
};

export default ExchangeMenu;
