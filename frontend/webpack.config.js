const path = require("path");
const webpack = require("webpack");
const dotenv = require("dotenv").config({
  path: path.join(__dirname, ".env"),
});

module.exports = () => {
  return {
    entry: "./src/index.js",
    output: {
      path: path.resolve(__dirname, "./static/js"),
      filename: "[name].js",
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
          },
        },
      ],
    },
    optimization: {
      minimize: true,
    },
    plugins: [
      new webpack.DefinePlugin({
        "process.env": JSON.stringify(dotenv.parsed),
      }),
    ],
    resolve: {
      fallback: {
        fs: false,
        os: false,
      },
    },
  };
};
