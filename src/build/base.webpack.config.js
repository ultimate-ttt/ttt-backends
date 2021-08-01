// https://dev.to/dnasir/azure-functions-node-js-typescript-webpack-a3m
// https://prateeksurana.me/blog/using-environment-variables-with-webpack/
const path = require('path');
const Dotenv = require('dotenv-webpack');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  target: 'node', // IMPORTANT!
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    plugins: [new TsconfigPathsPlugin()]
  },
  plugins: [
    new Dotenv({
      safe: true
    }),
    new CopyPlugin({
      patterns: [
        {
          // Copy function.json and host.json to dist
          from: "src/**/*.json",
          to({ context, absoluteFilename }) {
            const pathParts = absoluteFilename.split('/src/');
            const lastPart = pathParts[pathParts.length - 1];
            return Promise.resolve(lastPart);
          },
          globOptions: {
            // Don't ignore local.settings.json as it's only created locally and used for the ports
            ignore: ["**/dist/**", "**/*.settings.example.json"],
          },
        },
      ],
    }),
  ],
  output: {
    filename: '[name]/index.js',
    path: path.resolve(process.cwd(), 'src/dist'), // TODO maybe change this when az function stuff is cleared up
    library: {
      type: 'commonjs' // IMPORTANT!
    }
  }
};