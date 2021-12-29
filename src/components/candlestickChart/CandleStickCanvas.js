import React, { useRef } from "react";
import { convertUnixToDate } from "../timeUtils/timeUtils";
// props.data format [{date: null, open: null, close: null, high: null, low: null, volume: null}]
const CandleStickCanvas = (props) => {
  const canvasRef = useRef(null);
  const [dohlcvData, setDohlcvData] = React.useState([]);
  const [highLow, setHighLow] = React.useState([]);

  React.useEffect(() => {
    if (props.status === "succeeded") {
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

  React.useEffect(() => {
    if (dohlcvData.length > 0) {
      setHighLow(highestAndLowestResult(dohlcvData));
    }
  }, [dohlcvData]);

  console.log("hlr: ", highLow);

  const highestAndLowestResult = (data) => {
    let highLowPair = { high: 0, low: 0 };
    data.map((obj) => {
      if (obj.high > highLowPair.high) {
        highLowPair.high = obj.high;
      }
      if (highLowPair.low === 0) {
        highLowPair.low = obj.low;
      }
      if (obj.low < highLowPair.low) {
        highLowPair.low = obj.low;
      }
    });
    return highLowPair;
  };

  const tickMarkTime = (index) => {
    const month = (dohlcvData[index].date.getMonth() + 1).toString();
    const date = dohlcvData[index].date.getDate().toString();
    const hour = dohlcvData[index].date.getHours().toString();
    const minutes = dohlcvData[index].date.getMinutes().toString();
    return month + "/" + date + " " + hour + ":" + minutes + "0";
  };

  //   if (dohlcvData.open > dohlcvData.close) {
  //     // red candle
  //   } else if (dohlcvData.open < dohlcvData.close) {
  //     // green candle
  //   } else {
  //     // flourescent blue line
  //   }

  const ohlcCandle = (ctx, startX, width, height, index) => {
    const priceRange = highLow.high - highLow.low;
    const pixelRange = 250;
    const floor = 260;
    const pricePerPixel = priceRange / pixelRange;
    const offset = dohlcvData[index].open - highLow.low;
    const pixels = offset / pricePerPixel;
    const open = floor - pixels;
    //rectangle
    ctx.fillStyle = "#00ff00";
    ctx.fillRect(startX, open, width, height);
    //high, low
    // ctx.beginPath();
    // ctx.moveTo(startX + width / 2, open);
    // ctx.lineTo(startX + width / 2, 0);
    // ctx.strokeStyle = "#00ff00";
    // ctx.stroke();
  };

  const yAxis = (ctx) => {
    let tick0Number = 0;
    let tick1Number = 0;
    let tick2Number = 0;
    let tick3Number = 0;
    let tick4Number = 0;
    if (dohlcvData.length !== 0) {
      // const highLow = highestAndLowestResult(dohlcvData);
      //   console.log("lhl: ", localHighLow);
      const split = (highLow.high - highLow.low) / 4;
      tick0Number = Math.floor(highLow.low * 100) / 100;
      tick1Number = Math.floor((highLow.low + split) * 100) / 100;
      tick2Number = Math.floor((tick1Number + split) * 100) / 100;
      tick3Number = Math.floor((tick2Number + split) * 100) / 100;
      tick4Number = Math.floor(highLow.high * 100) / 100;
    }

    // y axis
    ctx.beginPath();
    ctx.moveTo(40, 10);
    ctx.lineTo(40, 270);
    ctx.strokeStyle = "white";
    ctx.stroke();

    // 4 tick marks
    ctx.beginPath();
    ctx.moveTo(30, 20);
    ctx.lineTo(50, 20);
    ctx.strokeStyle = "white";
    ctx.stroke();
    ctx.font = "12px serif";
    ctx.fillStyle = "aqua";
    ctx.textAlign = "right";
    ctx.fillText(tick4Number, 29, 24);

    ctx.beginPath();
    ctx.moveTo(30, 80);
    ctx.lineTo(50, 80);
    ctx.strokeStyle = "white";
    ctx.stroke();
    ctx.font = "12px serif";
    ctx.fillStyle = "aqua";
    ctx.fillText(tick3Number, 29, 84);

    ctx.beginPath();
    ctx.moveTo(30, 140);
    ctx.lineTo(50, 140);
    ctx.strokeStyle = "white";
    ctx.stroke();
    ctx.font = "12px serif";
    ctx.fillStyle = "aqua";
    ctx.fillText(tick2Number, 29, 144);

    ctx.beginPath();
    ctx.moveTo(30, 200);
    ctx.lineTo(50, 200);
    ctx.strokeStyle = "white";
    ctx.stroke();
    ctx.font = "12px serif";
    ctx.fillStyle = "aqua";
    ctx.fillText(tick1Number, 29, 204);

    ctx.font = "12px serif";
    ctx.fillStyle = "aqua";
    ctx.fillText(tick0Number, 29, 264);
  };

  const xAxis = (ctx) => {
    const xLength = 440 - 60;
    const split = xLength / 4;
    const xTickStart = 50;
    const yTickStart = 270;
    const yTickEnd = 250;
    // x axis
    ctx.beginPath();
    ctx.moveTo(30, 260);
    ctx.lineTo(440, 260);
    ctx.strokeStyle = "white";
    ctx.stroke();
    ctx.font = "12px serif";
    ctx.fillStyle = "aqua";
    //rotate text
    ctx.save();
    ctx.translate(xTickStart - 5, yTickStart + 5);
    ctx.rotate(Math.PI / 3.5);
    ctx.textAlign = "left";
    ctx.fillText(tickMarkTime(0), 0, 0);
    ctx.restore();

    // 4 tick marks
    ctx.beginPath();
    ctx.moveTo(xTickStart + split, yTickStart);
    ctx.lineTo(xTickStart + split, yTickEnd);
    ctx.strokeStyle = "white";
    ctx.stroke();
    ctx.font = "12px serif";
    ctx.fillStyle = "aqua";
    //rotate text
    ctx.save();
    ctx.translate(xTickStart + split - 5, yTickStart + 5);
    ctx.rotate(Math.PI / 3.5);
    ctx.textAlign = "left";
    ctx.fillText(tickMarkTime(5), 0, 0);
    ctx.restore();

    ctx.beginPath();
    ctx.moveTo(xTickStart + split * 2, yTickStart);
    ctx.lineTo(xTickStart + split * 2, yTickEnd);
    ctx.strokeStyle = "white";
    ctx.stroke();
    ctx.font = "12px serif";
    ctx.fillStyle = "aqua";
    //rotate text
    ctx.save();
    ctx.translate(xTickStart + split * 2 - 5, yTickStart + 5);
    ctx.rotate(Math.PI / 3.5);
    ctx.textAlign = "left";
    ctx.fillText(tickMarkTime(11), 0, 0);
    ctx.restore();

    ctx.beginPath();
    ctx.moveTo(xTickStart + split * 3, yTickStart);
    ctx.lineTo(xTickStart + split * 3, yTickEnd);
    ctx.strokeStyle = "white";
    ctx.stroke();
    ctx.font = "12px serif";
    ctx.fillStyle = "aqua";
    //rotate text
    ctx.save();
    ctx.translate(xTickStart + split * 3 - 5, yTickStart + 5);
    ctx.rotate(Math.PI / 3.5);
    ctx.textAlign = "left";
    ctx.fillText(tickMarkTime(17), 0, 0);
    ctx.restore();

    ctx.beginPath();
    ctx.moveTo(xTickStart + split * 4, yTickStart);
    ctx.lineTo(xTickStart + split * 4, yTickEnd);
    ctx.strokeStyle = "white";
    ctx.stroke();
    ctx.font = "12px serif";
    ctx.fillStyle = "aqua";
    //rotate text
    ctx.save();
    ctx.translate(xTickStart + split * 4 - 5, yTickStart + 5);
    ctx.rotate(Math.PI / 3.5);
    ctx.textAlign = "left";
    ctx.fillText(tickMarkTime(22), 0, 0);
    ctx.restore();
  };

  const draw = (ctx) => {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    xAxis(ctx);
    yAxis(ctx);
    ohlcCandle(ctx, 50, 10, 50, 0);
    // ohlcCandle(ctx, 61, 50, 10, 50);
    // ohlcCandle(ctx, 72, 50, 10, 50);
    // ohlcCandle(ctx, 83, 50, 10, 50);
    // ohlcCandle(ctx, 94, 50, 10, 50);
    // ohlcCandle(ctx, 105, 50, 10, 50);
    // ohlcCandle(ctx, 116, 50, 10, 50);
    // ohlcCandle(ctx, 127, 50, 10, 50);
    // ohlcCandle(ctx, 138, 50, 10, 50);
    // ohlcCandle(ctx, 149, 50, 10, 50);
    // ohlcCandle(ctx, 160, 50, 10, 50);
    // ohlcCandle(ctx, 171, 50, 10, 50);
    // ohlcCandle(ctx, 182, 50, 10, 50);
    // ohlcCandle(ctx, 193, 50, 10, 50);
    // ohlcCandle(ctx, 204, 50, 10, 50);
    // ohlcCandle(ctx, 215, 50, 10, 50);
    // ohlcCandle(ctx, 226, 50, 10, 50);
    // ohlcCandle(ctx, 237, 50, 10, 50);
    // ohlcCandle(ctx, 248, 50, 10, 50);
    // ohlcCandle(ctx, 259, 50, 10, 50);
    // ohlcCandle(ctx, 270, 50, 10, 50);
    // ohlcCandle(ctx, 281, 50, 10, 50);
    // ohlcCandle(ctx, 292, 50, 10, 50);
    // ohlcCandle(ctx, 303, 50, 10, 50);
  };

  React.useEffect(() => {
    if (dohlcvData.length > 0) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      canvas.height = 325;
      canvas.width = 450;

      draw(context);
    }
  }, [draw, props.status]);

  return <canvas ref={canvasRef} {...props} />;
};

export default CandleStickCanvas;
