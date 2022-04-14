import axios from "axios";

export const coinGecko = axios.create({
  baseURL: "https://api.coingecko.com/api/v3",
  headers: {
    "Content-Type": "application/json",
  },
});
