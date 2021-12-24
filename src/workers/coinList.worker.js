// import { useSelector } from "react-redux";
// const coinsAllSelector = useSelector(selectCoinsAll);

// coinsAllSelector.map((item) => {
//   if (item.symbol.toLowerCase().startsWith(coinSymbol.toLowerCase())) {
//     // populate symbol list
//     setCoinList((prevArray) => [...prevArray, item.symbol]);
//   }
// });

export default () => {
  onmessage = (message) => {
    let coinSymbol = "";
    let coinSelectorRaw = "";
    let coinList = [];
    coinSymbol = message.data.args[0];
    coinSelectorRaw = message.data.args[1];
    if (coinSymbol !== "") {
      coinSelectorRaw.forEach((element) => {
        if (element.symbol.toLowerCase().startsWith(coinSymbol.toLowerCase())) {
          coinList.push(element.symbol);
        }
      });
    }
    postMessage(coinList);
  };
};
