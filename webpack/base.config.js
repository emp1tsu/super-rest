const webpack = require("webpack");
const nodeExternals = require("webpack-node-externals");
const WebpackShellPlugin = require("webpack-shell-plugin");
const path = require("path");

const BUILD_ROOT = path.join(__dirname, "../dist");
const SRC_ROOT = path.join(__dirname, "../src");

module.exports = {
  context: SRC_ROOT,
  entry: path.resolve("src", "app.ts"),
  externals: [nodeExternals()],
  output: {
    filename: "app.js",
    path: BUILD_ROOT
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: "ts-loader",
        options: {
          configFile: "tsconfig.json"
        }
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".js", ".json"],
    alias: {
      "@": path.join(__dirname, "/src/")
    }
  },
  plugins: [
    new WebpackShellPlugin({
      onBuildEnd: ["yarn start"]
    })
  ]
};
