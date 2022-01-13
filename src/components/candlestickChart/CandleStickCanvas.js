import React, { useRef } from "react";
import { convertUnixToDate } from "../timeUtils/timeUtils";
// props.data format [{date: null, open: null, close: null, high: null, low: null, volume: null}]
const CandleStickCanvas = (props) => {
  const { data, status, datalastcandle, statuslastcandle } = props;
  const canvasRef = useRef(null);
  const [dohlcvData, setDohlcvData] = React.useState([]);
  const [dohlcvLastCandleData, setDohlcvLastCandleData] = React.useState([]);
  const [highestPrice, setHighestPrice] = React.useState(0);
  const [lowestPrice, setLowestPrice] = React.useState(0);
  const [highestLastCandlePrice, setHighestLastCandlePrice] = React.useState(0);
  const [lowestLastCandlePrice, setLowestLastCandlePrice] = React.useState(0);
  const [highestVolume, setHighestVolume] = React.useState(0);
  const [highestLastCandleVolume, setHighestLastCandleVolume] =
    React.useState(0);
  const [leftWall, setLeftWall] = React.useState(0);
  const [timePerPixel, setTimePerPixel] = React.useState(0);
  const [floor, setFloor] = React.useState(0);
  const [pricePerPixel, setPricePerPixel] = React.useState(0);
  const [volumeFloor, setVolumeFloor] = React.useState(0);
  const [volumePerPixel, setVolumePerPixel] = React.useState(0);

  React.useEffect(() => {
    if (status === "succeeded") {
      setDohlcvData([]);
      const dohlcv = Object.values(data);
      dohlcv.forEach((obj) => {
        obj.forEach((element) => {
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
    if (statuslastcandle === "succeeded") {
      setDohlcvLastCandleData([]);
      const dohlcvLastCandle = Object.values(datalastcandle);
      dohlcvLastCandle.forEach((obj) => {
        obj.forEach((element) => {
          let dohlcvLastCandleDataObj = {
            date: null,
            open: null,
            close: null,
            high: null,
            low: null,
            volume: null,
          };
          dohlcvLastCandleDataObj.date = element[0];
          dohlcvLastCandleDataObj.open = element[1];
          dohlcvLastCandleDataObj.high = element[2];
          dohlcvLastCandleDataObj.low = element[3];
          dohlcvLastCandleDataObj.close = element[4];
          dohlcvLastCandleDataObj.volume = element[5];
          setDohlcvLastCandleData((dohlcvLastCandleData) => [
            ...dohlcvLastCandleData,
            dohlcvLastCandleDataObj,
          ]);
        });
      });
    }
  }, [data, datalastcandle, status, statuslastcandle]);

  React.useEffect(() => {
    if (dohlcvData.length > 0 && dohlcvLastCandleData.length > 0) {
      let hlp = [];
      let hv = 0;
      hlp = highestAndLowestPriceResult(dohlcvData);
      hv = highestVolumeResult(dohlcvData);
      setHighestPrice(hlp.high);
      setLowestPrice(hlp.low);
      setHighestVolume(hv);
      hlp = highestAndLowestPriceResult(dohlcvLastCandleData);
      hv = highestVolumeResult(dohlcvLastCandleData);
      setHighestLastCandlePrice(hlp.high);
      setLowestLastCandlePrice(hlp.low);
      setHighestLastCandleVolume(hv);
    }
  }, [dohlcvData, dohlcvLastCandleData]);

  // try sorting low to high and grabbing last result for fun
  const highestAndLowestPriceResult = (data) => {
    let highLowPair = { high: 0, low: 0 };
    data.forEach((obj) => {
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

  // try sorting low to high and grabbing last result for fun
  const highestVolumeResult = (data) => {
    let highestVolume = 0;
    data.forEach((obj) => {
      if (obj.volume > highestVolume) {
        highestVolume = obj.volume;
      }
    });
    return highestVolume;
  };

  const tickMarkTime = (index) => {
    // time must be in unix seconds
    const dateConverted = convertUnixToDate(dohlcvData[index].date);
    const month = (dateConverted.getMonth() + 1).toString();
    const date = dateConverted.getDate().toString();
    const hour = dateConverted.getHours().toString();
    let minutes = dateConverted.getMinutes().toString();
    if (minutes === "0") {
      minutes = minutes + "0";
    }
    return month + "/" + date + " " + hour + ":" + minutes;
  };

  const tickMarkTimeLastCandle = () => {
    const dateConverted = convertUnixToDate(
      dohlcvLastCandleData[dohlcvLastCandleData.length - 1].date
    );
    const month = (dateConverted.getMonth() + 1).toString();
    const date = dateConverted.getDate().toString();
    const hour = dateConverted.getHours().toString();
    let minutes = dateConverted.getMinutes().toString();
    if (minutes.length === 1) {
      minutes = "0" + minutes;
    }
    return month + "/" + date + " " + hour + ":" + minutes;
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

  const candleScaling = () => {
    // set up for aligning candle bodies to time/dates on x-axis
    const dateRange = dohlcvData.length;
    const xPixelRange = 380;
    setLeftWall(60);
    setTimePerPixel(xPixelRange / dateRange);
    // sets up candle scaling to highest and lowest price
    const priceRange = highestPrice - lowestPrice;
    const yPixelRange = 200;
    setFloor(220);
    setPricePerPixel(priceRange / yPixelRange);
  };

  const lastCandleRescale = () => {
    let isRescale = false;
    if (highestLastCandlePrice > highestPrice) {
      setHighestPrice(highestLastCandlePrice);
      isRescale = true;
    }
    if (lowestLastCandlePrice < lowestPrice) {
      setLowestPrice(lowestLastCandlePrice);
      isRescale = true;
    }
    if (isRescale) {
      const priceRange = highestPrice - lowestPrice;
      const yPixelRange = 200;
      setFloor(220);
      setPricePerPixel(priceRange / yPixelRange);
    }
  };

  const volumeScaling = () => {
    // sets up volume scaling to highest and lowest volume
    const volumeRange = highestVolume;
    const yPixelRange = 40;
    setVolumeFloor(260);
    setVolumePerPixel(volumeRange / yPixelRange);
  };

  const lastVolumeRescale = () => {
    let isRescale = false;
    if (highestLastCandleVolume > highestVolume) {
      setHighestVolume(highestLastCandleVolume);
      isRescale = true;
    }
    if (isRescale) {
      const volumeRange = highestVolume;
      const yPixelRange = 40;
      setVolumeFloor(260);
      setVolumePerPixel(volumeRange / yPixelRange);
    }
  };

  const ohlcCandle = (ctx, width, index) => {
    // set up for aligning candle bodies to time/dates on x-axis
    const startX = leftWall - 5 + index * timePerPixel;
    // set up for open/close bodies corresponding to y-axis pricing
    const offsetOpen = dohlcvData[index].open - lowestPrice;
    const pixelsOpen = offsetOpen / pricePerPixel;
    const open = floor - pixelsOpen;
    const offsetClose = dohlcvData[index].close - lowestPrice;
    const pixelsClose = offsetClose / pricePerPixel;
    const close = floor - pixelsClose;
    let height = (open - close) * -1;

    // const startX = leftWall - 5 + 23 * timePerPixel;
    // const offsetOpen = dohlcvLastCandleData[0].open - lowestPrice;
    // const pixelsOpen = offsetOpen / pricePerPixel;
    // const open = floor - pixelsOpen;
    // const offsetClose =
    //   dohlcvLastCandleData[dohlcvLastCandleData.length - 1].close - lowestPrice;
    // const pixelsClose = offsetClose / pricePerPixel;
    // const close = floor - pixelsClose;
    // let height = (open - close) * -1;

    let color = "";
    if (height < 0) {
      color = "#00ff00";
      if (height > -1) {
        height = -1;
      }
    } else if (height > 0) {
      color = "#ff0000";
      if (height < 1) {
        height = 1;
      }
    } else {
      color = "#0000ff";
      height = 1;
    }
    // draw candle body
    ctx.fillStyle = color;
    ctx.fillRect(startX, open, width, height);

    // setup for high/low wicks corresponding to y-axis pricing
    const offsetHigh = dohlcvData[index].high - lowestPrice;
    const pixelsHigh = offsetHigh / pricePerPixel;
    const high = floor - pixelsHigh;
    const offsetLow = dohlcvData[index].low - lowestPrice;
    const pixelsLow = offsetLow / pricePerPixel;
    const low = floor - pixelsLow;

    // high
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

  const ohlcCandleLast = (ctx, width) => {
    const startX = leftWall - 5 + 23 * timePerPixel;
    const offsetOpen = dohlcvLastCandleData[0].open - lowestPrice;
    const pixelsOpen = offsetOpen / pricePerPixel;
    const open = floor - pixelsOpen;
    const offsetClose =
      dohlcvLastCandleData[dohlcvLastCandleData.length - 1].close - lowestPrice;
    const pixelsClose = offsetClose / pricePerPixel;
    const close = floor - pixelsClose;
    let height = (open - close) * -1;
    let color = "";
    if (height < 0) {
      color = "#00ff00";
      if (height > -1) {
        height = -1;
      }
    } else if (height > 0) {
      color = "#ff0000";
      if (height < 1) {
        height = 1;
      }
    } else {
      color = "#0000ff";
      height = 1;
    }
    // draw candle body
    ctx.fillStyle = color;
    ctx.fillRect(startX, open, width, height);

    // setup for high/low wicks corresponding to y-axis pricing
    const offsetHigh = highestLastCandlePrice - lowestPrice;
    const pixelsHigh = offsetHigh / pricePerPixel;
    const high = floor - pixelsHigh;
    const offsetLow = lowestLastCandlePrice - lowestPrice;
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

  const ohlcVolume = (ctx, width, index) => {
    // set up for aligning candle bodies to time/dates on x-axis
    const startX = leftWall - 5 + index * timePerPixel;
    // set up for open/close bodies corresponding to y-axis units
    const offsetTop = dohlcvData[index].volume;
    const pixelsTop = offsetTop / volumePerPixel;
    const volTop = volumeFloor - pixelsTop;
    let height = volumeFloor - volTop;
    // draw candle body
    ctx.fillStyle = "aqua";
    ctx.fillRect(startX, volTop, width, height);
  };

  const ohlcVolumeLast = (ctx, width) => {
    // set up for aligning candle bodies to time/dates on x-axis
    const startX = leftWall - 5 + 23 * timePerPixel;
    let totalVolume = 0;
    dohlcvLastCandleData.forEach((element) => {
      totalVolume += element.volume;
    });
    const offsetTop = totalVolume;
    const pixelsTop = offsetTop / volumePerPixel;
    const volTop = volumeFloor - pixelsTop;
    let height = volumeFloor - volTop;
    // draw candle body
    ctx.fillStyle = "aqua";
    ctx.fillRect(startX, volTop, width, height);
  };

  // set up for y-axis length, number of ticks
  const yAxis = (ctx) => {
    const yStart = 20;
    const yStartText = 24;
    let tick0Number = 0;
    let tick1Number = 0;
    let tick2Number = 0;
    let tick3Number = 0;
    let tick4Number = 0;
    let splitPrice = 0;
    let priceAxisLength = 200;
    const splitAxis = priceAxisLength / 4;
    if (dohlcvData.length > 0) {
      splitPrice = (highestPrice - lowestPrice) / 4;
      tick0Number = digitFilter(lowestPrice);
      tick1Number = digitFilter(lowestPrice + splitPrice);
      tick2Number = digitFilter(lowestPrice + splitPrice * 2);
      tick3Number = digitFilter(lowestPrice + splitPrice * 3);
      tick4Number = digitFilter(highestPrice);
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
  };

  // set up for x axis length, number of ticks
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
    ctx.moveTo(xTickStart + split * 23, yTickStart);
    ctx.lineTo(xTickStart + split * 23, yTickEnd);
    ctx.strokeStyle = "white";
    ctx.stroke();
    ctx.font = "12px serif";
    ctx.fillStyle = "aqua";
    //rotate text
    ctx.save();
    ctx.translate(xTickStart + split * 23 - 5, yTickStart + 5);
    ctx.rotate(Math.PI / 3.5);
    ctx.textAlign = "left";
    ctx.fillText(tickMarkTimeLastCandle(), 0, 0);
    ctx.restore();
  };

  const draw = (ctx) => {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    xAxis(ctx);
    yAxis(ctx);
    candleScaling();
    lastCandleRescale();
    volumeScaling();
    lastVolumeRescale(); // tbd if working
    for (let i = 0; i < dohlcvData.length; i++) {
      ohlcCandle(ctx, 11, i);
      ohlcVolume(ctx, 11, i);
    }
    ohlcCandleLast(ctx, 11);
    ohlcVolumeLast(ctx, 11);
  };

  React.useEffect(() => {
    if (dohlcvData.length > 0 && dohlcvLastCandleData.length > 0) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      canvas.height = 325;
      canvas.width = 485;

      draw(context);
    }
  });

  return <canvas ref={canvasRef} {...props} />;
};

// React.useEffect(() => {
//     createGraphics();
//   }, [createGraphics]);

export default CandleStickCanvas;
