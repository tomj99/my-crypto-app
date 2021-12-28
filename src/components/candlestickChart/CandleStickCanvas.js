import React, { useRef } from "react";
import { convertUnixToDate } from "../timeUtils/timeUtils";
// props.data format [{date: null, open: null, close: null, high: null, low: null, volume: null}]
const CandleStickCanvas = (props) => {
  const canvasRef = useRef(null);
  const [dohlcvData, setDohlcvData] = React.useState([]);

  React.useEffect(() => {
    if (props.data.length !== 0) {
      setDohlcvData([]);
      const dohlcv = Object.values(props.data);
      dohlcv.map((obj) => {
        obj.map((element) => {
          let dohlcvDataObj = {
            date: null,
            open: null,
            close: null,
            high: null,
            low: null,
            volume: null,
          };
          dohlcvDataObj.date = convertUnixToDate(element[0]);
          dohlcvDataObj.open = element[1];
          dohlcvDataObj.high = element[2];
          dohlcvDataObj.low = element[3];
          dohlcvDataObj.close = element[4];
          dohlcvDataObj.volume = element[5];
          setDohlcvData((dohlcvData) => [...dohlcvData, dohlcvDataObj]);
        });
      });
    }
  }, [props.data]);

  const highestResult = (data) => {
    let highestHigh = 0;
    data.map((obj) => {
      if (obj.high > highestHigh) {
        highestHigh = obj.high;
      }
    });
    return highestHigh;
  };

  const lowestResult = (data) => {
    let lowestLow = 0;
    data.map((obj) => {
      if (lowestLow === 0) {
        lowestLow = obj.low;
      }
      if (obj.low < lowestLow) {
        lowestLow = obj.low;
      }
    });
    return lowestLow;
  };

  //   if (dohlcvData.open > dohlcvData.close) {
  //     // red candle
  //   } else if (dohlcvData.open < dohlcvData.close) {
  //     // green candle
  //   } else {
  //     // flourescent blue line
  //   }

  const ohlcCandle = (ctx, startX, startY, width, height) => {
    //rectangle
    ctx.fillStyle = "#00ff00";
    ctx.fillRect(startX, startY, width, height);
    //high, low
    ctx.beginPath();
    ctx.moveTo(startX + width / 2, startY);
    ctx.lineTo(startX + width / 2, 0);
    ctx.strokeStyle = "#00ff00";
    ctx.stroke();
  };

  const xAxis = (ctx) => {
    if (dohlcvData.length !== 0) {
      const localHigh = highestResult(dohlcvData);
      const localLow = lowestResult(dohlcvData);
      const split = (localHigh - localLow) / 4;
      const tick0Number = localLow;
      const tick1Number = localLow + split;
      const tick2Number = tick1Number + split;
      const tick3Number = tick2Number + split;
      const tick4Number = localHigh;

      console.log("T0: ", tick0Number);
      console.log("T1: ", tick1Number);
      console.log("T2: ", tick2Number);
      console.log("T3: ", tick3Number);
      console.log("T4: ", tick4Number);
    }
    ctx.beginPath();
    ctx.moveTo(40, 10);
    ctx.lineTo(40, 270);
    ctx.strokeStyle = "white";
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(30, 20);
    ctx.lineTo(50, 20);
    ctx.strokeStyle = "white";
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(30, 80);
    ctx.lineTo(50, 80);
    ctx.strokeStyle = "white";
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(30, 140);
    ctx.lineTo(50, 140);
    ctx.strokeStyle = "white";
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(30, 200);
    ctx.lineTo(50, 200);
    ctx.strokeStyle = "white";
    ctx.stroke();
  };

  const yAxis = (ctx) => {
    ctx.beginPath();
    ctx.moveTo(30, 260);
    ctx.lineTo(440, 260);
    ctx.strokeStyle = "white";
    ctx.stroke();
  };

  const draw = (ctx) => {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    xAxis(ctx);
    yAxis(ctx);
    ohlcCandle(ctx, 50, 50, 10, 50);
  };

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    canvas.height = 300;
    canvas.width = 450;

    draw(context);
  }, [draw]);

  return <canvas ref={canvasRef} {...props} />;
};

export default CandleStickCanvas;
