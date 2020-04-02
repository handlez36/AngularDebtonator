const { environment } = require("@rails/webpacker");
const typescript = require("./loaders/typescript");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

environment.loaders.prepend("typescript", typescript);
environment.loaders.prepend("html", {
  test: /\.html$/,
  exclude: /node_modules/,
  loaders: ["html-loader"]
});

environment.plugins.prepend(
  "minicss",
  new MiniCssExtractPlugin({ filename: "[name].css" })
);

module.exports = environment;
