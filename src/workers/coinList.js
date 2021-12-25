let coinList = (msg) => {
  let coinSymbol = "";
  let coinSelectorRaw = "";
  let coinList = [];
  coinSymbol = msg.data.args[0];
  coinSelectorRaw = msg.data.args[1];
  if (coinSymbol !== "") {
    coinSelectorRaw.forEach((element) => {
      if (element.symbol.toLowerCase().startsWith(coinSymbol.toLowerCase())) {
        coinList.push(element.symbol);
      }
    });
  }
  return coinList;
};

export default coinList;
