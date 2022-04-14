import React from "react";
import CoinList from "../../components/coinlist/CoinList";
import MainHeader from "../../components/mainHeader/MainHeader";
import Box from "@mui/material/Box";
const HomePage = () => {
  return (
    <Box>
      <MainHeader />

      <CoinList />
    </Box>
  );
};

export default HomePage;
