import React from "react";
import HomePage from "./pages/homePage/HomePage";
import FullChartPage from "./pages/fullChartPage/FullChartPage";
import PortfolioPage from "./pages/portfolilPage/PortfolioPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route exact path="/chart" element={<FullChartPage />} />
        <Route exact path="/portfolio" element={<PortfolioPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
