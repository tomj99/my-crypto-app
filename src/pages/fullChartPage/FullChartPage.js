import React from "react";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";

const FullChartPage = () => {
  const navigate = useNavigate();
  function handleHomeClick() {
    navigate("/");
  }

  return (
    <Box>
      <h1>Chart Page</h1>
      <Button variant="contained" onClick={handleHomeClick}>
        Home
      </Button>
    </Box>
  );
};

export default FullChartPage;

// to navigate to a new page
// import { useNavigate } from "react-router-dom";
// const navigate = useNavigate();
// navigate("/newpage");
// the new page must be in the router
