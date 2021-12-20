import React from "react";
import { selectChartData } from "../../redux/selectors";
import { useSelector } from "react-redux";
import {
  VictoryCandlestick,
  VictoryChart,
  VictoryTheme,
  VictoryAxis,
} from "victory";

const CandleStickChart = () => {
  const chartDataSelector = useSelector(selectChartData);
  // console.log("data: ", chartDataSelector);

  return (
    <VictoryChart
      theme={VictoryTheme.grayscale}
      domainPadding={{ x: 10 }}
      scale={{ x: "time" }}
    >
      <VictoryAxis
        scale="time"
        //tickFormat={(t) => `${t}`}
        fixLabelOverlap
        style={{ tickLabels: { padding: 12, fontSize: 14 } }}
      />
      <VictoryAxis
        dependentAxis
        // axisLabelComponent={<VictoryLabel dx={20} />}
      />
      <VictoryCandlestick
        data={[
          { x: new Date(2016, 5, 12), open: 5, close: 10, high: 15, low: 0 },
          { x: new Date(2016, 5, 13), open: 10, close: 15, high: 20, low: 5 },
          { x: new Date(2016, 5, 14), open: 15, close: 20, high: 22, low: 10 },
          { x: new Date(2016, 5, 15), open: 20, close: 10, high: 50, low: 7 },
          { x: new Date(2016, 5, 16), open: 10, close: 8, high: 15, low: 5 },
          { x: new Date(2016, 5, 17), open: 10, close: 8, high: 15, low: 5 },
          { x: new Date(2016, 5, 18), open: 10, close: 8, high: 15, low: 5 },
          { x: new Date(2016, 5, 19), open: 10, close: 8, high: 15, low: 5 },
          { x: new Date(2016, 5, 20), open: 10, close: 8, high: 15, low: 5 },
          { x: new Date(2016, 5, 21), open: 10, close: 8, high: 15, low: 5 },
          { x: new Date(2016, 5, 22), open: 10, close: 8, high: 15, low: 5 },
          { x: new Date(2016, 5, 23), open: 10, close: 8, high: 15, low: 5 },
          { x: new Date(2016, 5, 24), open: 10, close: 8, high: 15, low: 5 },
          { x: new Date(2016, 5, 25), open: 10, close: 8, high: 15, low: 5 },
          { x: new Date(2016, 5, 26), open: 10, close: 8, high: 15, low: 5 },
          { x: new Date(2016, 5, 27), open: 10, close: 8, high: 15, low: 5 },
          { x: new Date(2016, 5, 28), open: 10, close: 8, high: 15, low: 5 },
          { x: new Date(2016, 5, 29), open: 10, close: 8, high: 15, low: 5 },
          { x: new Date(2016, 5, 30), open: 10, close: 8, high: 15, low: 5 },
          { x: new Date(2016, 6, 1), open: 10, close: 8, high: 15, low: 5 },
          { x: new Date(2016, 6, 2), open: 10, close: 8, high: 15, low: 5 },
          { x: new Date(2016, 6, 3), open: 10, close: 8, high: 15, low: 5 },
          { x: new Date(2016, 6, 4), open: 10, close: 8, high: 15, low: 5 },
          { x: new Date(2016, 6, 5), open: 10, close: 8, high: 15, low: 5 },
        ]}
        candleWidth={12}
        candleColors={{ positive: "#00ff00", negative: "#ff0000" }}
      />
    </VictoryChart>
  );
};

export default CandleStickChart;

// data={this.state.ordered_data}

// {Object {
//     "close": 54.58,
//     "high": 55.19,
//     "low": 53.7,
//     "open": 54.56,
//     "x": "2021-02-03",
//   },
//   Object {
//     "close": 54,
//     "high": 54.87,
//     "low": 52.71,
//     "open": 52.865,
//     "x": "2021-02-02",
//   },
//   Object {
//     "close": 52.66,
//     "high": 52.75,
//     "low": 51.0718,
//     "open": 51.2,
//     "x": "2021-02-01",
//   },}
