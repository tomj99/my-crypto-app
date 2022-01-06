import * as React from "react";
import Button from "@mui/material/Button";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Stack from "@mui/material/Stack";
import { ArrowDropDownCircleSharp } from "@material-ui/icons";

const ExchangeMenu = () => {
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const anchorRef = React.useRef("exchange");
  const clickIt = React.useCallback(() => {
    anchorRef.current.click();
  }, [anchorRef]);

  React.useEffect(() => {
    clickIt();
  }, [clickIt]);

  //   const handleToggle = () => {
  //     setOpen((prevOpen) => !prevOpen);
  //   };

  const handleClose = (event) => {
    setOpen(false);
  };

  const handleExchangeClick = (Event) => {
    setOpen(true);
    setAnchorEl(Event.currentTarget);
    console.log("button clicked");
  };

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
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === "bottom-start" ? "left top" : "left bottom",
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    autoFocusItem={open}
                    id="composition-menu"
                    aria-labelledby="exchange-button"
                  >
                    <MenuItem onClick={handleClose}>Profile</MenuItem>
                    <MenuItem onClick={handleClose}>My account</MenuItem>
                    <MenuItem onClick={handleClose}>Logout</MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    </Stack>
  );
};

export default ExchangeMenu;
