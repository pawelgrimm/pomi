const path = require("path");
const nodeExternals = require("webpack-node-externals");
const Dotenv = require("dotenv-webpack");
const debug = require("debug");

const entry = { server: "./src/server/index.ts" };

module.exports = (env) => {
  const mode = env.prod ? "production" : "development";
  console.log("Webpack mode: ", mode);

  return {
    mode,
    target: "node",
    devtool: "inline-source-map",
    entry: entry,
    output: {
      path: path.resolve(__dirname, "build"),
      filename: "[name].js",
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js"],
    },
    // don't compile node_modules
    externals: [nodeExternals()],
    plugins: [
      new Dotenv({
        path: "src/server/config/.env.development",
        defaults: "src/server/config/.env.defaults",
      }),
    ],
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: "ts-loader",
              options: {
                // use the tsconfig in the server directory
                configFile: "src/server/tsconfig.json",
              },
            },
          ],
        },
      ],
    },
  };
};
