const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: 'development',
  entry: {
    index:"./src/index.js",
  },
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new CopyWebpackPlugin([{ from: "./src/index.html", to: "index.html" }]),
    new CopyWebpackPlugin([{ from: "./src/register.html", to: "register.html" }]),
    new CopyWebpackPlugin([{ from: "./src/home.html", to: "home.html" }]),
  ],
  devServer: { contentBase: path.join(__dirname, "dist"), compress: true },
};
