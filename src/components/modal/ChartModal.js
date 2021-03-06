import * as React from "react";
import Box from "@mui/material/Box";
import CandleStickChart from "../candlestickChart/CandleStickChart";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { useSelector } from "react-redux";

const ChartModal = (props) => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };

  return (
    <Modal hideBackdrop open={props.openModal} onClose={props.handleModalClose}>
      <Box sx={{ ...style, width: 300 }}>
        <h3>Coin: {props.coinText}</h3>
        <h3>Price: {props.price}</h3>
        <CandleStickChart />
        <Button onClick={props.handleModalClick1}>Show Full Chart</Button>
        <Button onClick={props.handleModalClick2}>Add to Portfolio</Button>
      </Box>
    </Modal>
  );
};

export default ChartModal;
