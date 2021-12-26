import React from "react";
import { selectOhlcData } from "../../redux/selectors";
import { useSelector } from "react-redux";
import {
  VictoryCandlestick,
  VictoryChart,
  VictoryTheme,
  VictoryAxis,
} from "victory";

const CandleStickChart = () => {
  const ohlcDataSelector = useSelector(selectOhlcData);
  const [ohlcData, setOhlcData] = React.useState([]);

  React.useEffect(() => {
    if (ohlcDataSelector.length !== 0) {
      setOhlcData([]);
      const ohlc = Object.values(ohlcDataSelector);
      ohlc.map((array) => {
        array.map((element) => {
          let ohlcDataObj = {
            date: null,
            open: null,
            close: null,
            high: null,
            low: null,
          };
          ohlcDataObj.date = element[0];
          ohlcDataObj.open = element[1];
          ohlcDataObj.close = element[4];
          ohlcDataObj.high = element[2];
          ohlcDataObj.low = element[3];
          setOhlcData((ohlcData) => [...ohlcData, ohlcDataObj]);
        });
      });
    }
  }, [ohlcDataSelector]);

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
        data={ohlcData}
        candleWidth={12}
        candleColors={{ positive: "#00ff00", negative: "#ff0000" }}
      />
    </VictoryChart>
  );
};

export default CandleStickChart;
