const { createProxyMiddleware } = require("http-proxy-middleware");
module.exports = function (app) {
  app.use(
    "/assets",
    createProxyMiddleware({
      target: "https://api.cryptowat.ch",
      changeOrigin: true,
    })
  );
  app.use(
    "/markets",
    createProxyMiddleware({
      target: "https://api.cryptowat.ch",
      changeOrigin: true,
    })
  );
};

//es6 conversion that doesn't seem to work

// import { createProxyMiddleware } from "http-proxy-middleware";
// export default function (app) {
//   app.use(
//     "/assets",
//     createProxyMiddleware({
//       target: "https://api.cryptowat.ch",
//       changeOrigin: true,
//     })
//   );
//   app.use(
//     "/markets",
//     createProxyMiddleware({
//       target: "https://api.cryptowat.ch",
//       changeOrigin: true,
//     })
//   );
// };
