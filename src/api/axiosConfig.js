import axios from "axios";

const coinGecko = axios.create({
  baseURL: "https://api.coingecko.com/api/v3",
  headers: {
    "Content-Type": "application/json",
  },
});

const cryptoWatch = axios.create({
  baseURL: "https://api.cryptowat.ch",
  headers: {
    "Content-Type": "application/json",
  },
});

export { coinGecko, cryptoWatch };
