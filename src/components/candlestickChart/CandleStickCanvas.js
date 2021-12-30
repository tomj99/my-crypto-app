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
          dohlcvDataObj.date = element[0];
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
  console.log("dohlcv: ", dohlcvData);
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
    const dateConverted = convertUnixToDate(dohlcvData[index].date);
    const month = (dateConverted.getMonth() + 1).toString();
    const date = dateConverted.getDate().toString();
    const hour = dateConverted.getHours().toString();
    const minutes = dateConverted.getMinutes().toString();
    return month + "/" + date + " " + hour + ":" + minutes + "0";
  };

  function digitFilter(number) {
    if (number > 0 && number < 1) {
      number = Math.floor(number * 1000000) / 1000000;
    }
    if (number >= 1 && number < 10) {
      number = Math.floor(number * 10000) / 10000;
    }
    if (number >= 10 && number < 100) {
      number = Math.floor(number * 1000) / 1000;
    }
    if (number >= 100 && number < 10000) {
      number = Math.floor(number * 100) / 100;
    }
    if (number >= 10000) {
      number = Math.floor(number);
    }
    return number;
  }

  const ohlcCandle = (ctx, width, index) => {
    // set up for aligning candle bodies to time/dates on x-axis
    const dateRange = dohlcvData.length;
    const xPixelRange = 380;
    const leftWall = 60;
    const timePerPixel = xPixelRange / dateRange;
    const startX = leftWall - 5 + index * timePerPixel;
    // set up for open/close bodies corresponding to y-axis pricing
    const priceRange = highLow.high - highLow.low;
    const yPixelRange = 230;
    const floor = 250;
    const pricePerPixel = priceRange / yPixelRange;
    const offsetOpen = dohlcvData[index].open - highLow.low;
    const pixelsOpen = offsetOpen / pricePerPixel;
    const open = floor - pixelsOpen;
    const offsetClose = dohlcvData[index].close - highLow.low;
    const pixelsClose = offsetClose / pricePerPixel;
    const close = floor - pixelsClose;
    const height = (open - close) * -1;
    let color = "";
    if (height < 0) {
      color = "#00ff00";
    } else if (height > 0) {
      color = "#ff0000";
    } else {
      color = "#0000ff";
    }
    // draw candle body
    ctx.fillStyle = color;
    ctx.fillRect(startX, open, width, height);

    // setup for high/low wicks corresponding to y-axis pricing
    const offsetHigh = dohlcvData[index].high - highLow.low;
    const pixelsHigh = offsetHigh / pricePerPixel;
    const high = floor - pixelsHigh;
    const offsetLow = dohlcvData[index].low - highLow.low;
    const pixelsLow = offsetLow / pricePerPixel;
    const low = floor - pixelsLow;

    //high
    ctx.beginPath();
    ctx.lineWidth = 1.5;
    if (height < 0) {
      ctx.moveTo(startX + 5, close);
      ctx.lineTo(startX + 5, high);
    } else if (height > 0) {
      ctx.moveTo(startX + 5, open);
      ctx.lineTo(startX + 5, high);
    } else {
      ctx.moveTo(startX + 5, open);
      ctx.lineTo(startX + 5, high);
    }
    ctx.strokeStyle = color;
    ctx.stroke();
    //low
    ctx.beginPath();
    ctx.lineWidth = 1.5;
    if (height < 0) {
      ctx.moveTo(startX + 5, open);
      ctx.lineTo(startX + 5, low);
    } else if (height > 0) {
      ctx.moveTo(startX + 5, close);
      ctx.lineTo(startX + 5, low);
    } else {
      ctx.moveTo(startX + 5, open);
      ctx.lineTo(startX + 5, low);
    }
    ctx.strokeStyle = color;
    ctx.stroke();
  };

  const ohlcCandleLast = () => {};

  const yAxis = (ctx) => {
    const yStart = 20;
    const yStartText = 24;
    let tick0Number = 0;
    let tick1Number = 0;
    let tick2Number = 0;
    let tick3Number = 0;
    let tick4Number = 0;
    let splitPrice = 0;
    const splitAxis = 230 / 4;
    if (dohlcvData.length !== 0) {
      // const highLow = highestAndLowestResult(dohlcvData);
      //   console.log("lhl: ", localHighLow);
      splitPrice = (highLow.high - highLow.low) / 4;
      tick0Number = digitFilter(highLow.low);
      tick1Number = digitFilter(highLow.low + splitPrice);
      tick2Number = digitFilter(highLow.low + splitPrice * 2);
      tick3Number = digitFilter(highLow.low + splitPrice * 3);
      tick4Number = digitFilter(highLow.high);
    }

    // y axis
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.moveTo(50, 10);
    ctx.lineTo(50, 270);
    ctx.strokeStyle = "white";
    ctx.stroke();

    // 5 tick marks
    // tick 4
    ctx.beginPath();
    ctx.lineWidth = 0.35;
    ctx.moveTo(40, yStart);
    ctx.lineTo(450, yStart);
    ctx.strokeStyle = "white";
    ctx.stroke();
    ctx.font = "12px serif";
    ctx.fillStyle = "aqua";
    ctx.textAlign = "right";
    ctx.fillText(tick4Number, 40, yStartText);
    // tick 3
    ctx.beginPath();
    ctx.lineWidth = 0.35;
    ctx.moveTo(40, yStart + splitAxis);
    ctx.lineTo(450, yStart + splitAxis);
    ctx.strokeStyle = "white";
    ctx.stroke();
    ctx.font = "12px serif";
    ctx.fillStyle = "aqua";
    ctx.fillText(tick3Number, 40, yStartText + splitAxis);
    //tick 2
    ctx.beginPath();
    ctx.lineWidth = 0.35;
    ctx.moveTo(40, yStart + splitAxis * 2);
    ctx.lineTo(450, yStart + splitAxis * 2);
    ctx.strokeStyle = "white";
    ctx.stroke();
    ctx.font = "12px serif";
    ctx.fillStyle = "aqua";
    ctx.fillText(tick2Number, 40, yStartText + splitAxis * 2);
    //tick 1
    ctx.beginPath();
    ctx.lineWidth = 0.35;
    ctx.moveTo(40, yStart + splitAxis * 3);
    ctx.lineTo(450, yStart + splitAxis * 3);
    ctx.strokeStyle = "white";
    ctx.stroke();
    ctx.font = "12px serif";
    ctx.fillStyle = "aqua";
    ctx.fillText(tick1Number, 40, yStartText + splitAxis * 3);

    // tick 0
    ctx.beginPath();
    ctx.lineWidth = 0.35;
    ctx.moveTo(40, yStart + splitAxis * 4);
    ctx.lineTo(450, yStart + splitAxis * 4);
    ctx.strokeStyle = "white";
    ctx.stroke();
    ctx.font = "12px serif";
    ctx.fillStyle = "aqua";
    ctx.textAlign = "right";
    ctx.fillText(tick0Number, 40, yStartText + splitAxis * 4);

    // ctx.font = "12px serif";
    // ctx.fillStyle = "aqua";
    // ctx.fillText(tick0Number, 29, 264);
  };

  const xAxis = (ctx) => {
    const xLength = 440 - 60;
    const split = xLength / 23;
    const xTickStart = 60;
    const yTickStart = 270;
    const yTickEnd = 10;
    // x axis
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.moveTo(40, 260);
    ctx.lineTo(450, 260);
    ctx.strokeStyle = "white";
    ctx.stroke();
    ctx.font = "12px serif";
    ctx.fillStyle = "aqua";

    // 5 tick marks
    //tick 1
    ctx.beginPath();
    ctx.lineWidth = 0.35;
    ctx.moveTo(xTickStart, yTickStart);
    ctx.lineTo(xTickStart, yTickEnd);
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
    //tick 2
    ctx.beginPath();
    ctx.lineWidth = 0.35;
    ctx.moveTo(xTickStart + split * 5, yTickStart);
    ctx.lineTo(xTickStart + split * 5, yTickEnd);
    ctx.strokeStyle = "white";
    ctx.stroke();
    ctx.font = "12px serif";
    ctx.fillStyle = "aqua";
    //rotate text
    ctx.save();
    ctx.translate(xTickStart + split * 5 - 5, yTickStart + 5);
    ctx.rotate(Math.PI / 3.5);
    ctx.textAlign = "left";
    ctx.fillText(tickMarkTime(5), 0, 0);
    ctx.restore();
    //tick 3
    ctx.beginPath();
    ctx.lineWidth = 0.35;
    ctx.moveTo(xTickStart + split * 11, yTickStart);
    ctx.lineTo(xTickStart + split * 11, yTickEnd);
    ctx.strokeStyle = "white";
    ctx.stroke();
    ctx.font = "12px serif";
    ctx.fillStyle = "aqua";
    //rotate text
    ctx.save();
    ctx.translate(xTickStart + split * 11 - 5, yTickStart + 5);
    ctx.rotate(Math.PI / 3.5);
    ctx.textAlign = "left";
    ctx.fillText(tickMarkTime(11), 0, 0);
    ctx.restore();
    // tick 4
    ctx.beginPath();
    ctx.lineWidth = 0.35;
    ctx.moveTo(xTickStart + split * 17, yTickStart);
    ctx.lineTo(xTickStart + split * 17, yTickEnd);
    ctx.strokeStyle = "white";
    ctx.stroke();
    ctx.font = "12px serif";
    ctx.fillStyle = "aqua";
    //rotate text
    ctx.save();
    ctx.translate(xTickStart + split * 17 - 5, yTickStart + 5);
    ctx.rotate(Math.PI / 3.5);
    ctx.textAlign = "left";
    ctx.fillText(tickMarkTime(17), 0, 0);
    ctx.restore();
    // tick 5
    ctx.beginPath();
    ctx.lineWidth = 0.35;
    ctx.moveTo(xTickStart + split * 22, yTickStart);
    ctx.lineTo(xTickStart + split * 22, yTickEnd);
    ctx.strokeStyle = "white";
    ctx.stroke();
    ctx.font = "12px serif";
    ctx.fillStyle = "aqua";
    //rotate text
    ctx.save();
    ctx.translate(xTickStart + split * 22 - 5, yTickStart + 5);
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
    ohlcCandle(ctx, 10, 0);
    ohlcCandle(ctx, 10, 1);
    ohlcCandle(ctx, 10, 2);
    ohlcCandle(ctx, 10, 3);
    ohlcCandle(ctx, 10, 4);
    ohlcCandle(ctx, 10, 5);
    ohlcCandle(ctx, 10, 6);
    ohlcCandle(ctx, 10, 7);
    ohlcCandle(ctx, 10, 8);
    ohlcCandle(ctx, 10, 9);
    ohlcCandle(ctx, 10, 10);
    ohlcCandle(ctx, 10, 11);
    ohlcCandle(ctx, 10, 12);
    ohlcCandle(ctx, 10, 13);
    ohlcCandle(ctx, 10, 14);
    ohlcCandle(ctx, 10, 15);
    ohlcCandle(ctx, 10, 16);
    ohlcCandle(ctx, 10, 17);
    ohlcCandle(ctx, 10, 18);
    ohlcCandle(ctx, 10, 19);
    ohlcCandle(ctx, 10, 20);
    ohlcCandle(ctx, 10, 21);
    ohlcCandle(ctx, 10, 22);
  };

  React.useEffect(() => {
    if (dohlcvData.length > 0) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      canvas.height = 325;
      canvas.width = 475;

      draw(context);
    }
  }, [draw, props.status]);

  return <canvas ref={canvasRef} {...props} />;
};

export default CandleStickCanvas;
