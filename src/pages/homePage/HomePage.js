import React from "react";
import CoinList from "../../components/coinlist/CoinList";
import MainHeader from "../../components/mainHeader/MainHeader";
import Box from "@mui/material/Box";
const HomePage = () => {
  return (
    <Box>
      <MainHeader />
      <h1>Coins - Top 50 by Volume</h1>
      <CoinList />
    </Box>
  );
};

export default HomePage;
