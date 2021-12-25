// import coinList from "./coinList";

const CoinListWorker = () => {
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

// const CoinListWorker = () => {
//   onmessage = (message) => {
//     postMessage(coinList(message));
//   };
// };

export default CoinListWorker;
