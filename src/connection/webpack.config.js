// https://dev.to/dnasir/azure-functions-node-js-typescript-webpack-a3m
// https://prateeksurana.me/blog/using-environment-variables-with-webpack/
const path = require('path');
const Dotenv = require('dotenv-webpack');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

// TODO base webpack.config ?
module.exports = {
  target: 'node', // IMPORTANT!
  entry: {
    'connect': './src/connect/index.ts',
    'create': './src/create/index.ts' 
  },
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
    new Dotenv(),
  ],
  output: {
    filename: '[name]/index.js',
    path: path.resolve(__dirname, 'src/dist'), // TODO maybe change this when az function stuff is cleared up
    library: {
      // maybe change to module when it's not experimental anymore in webpack
      type: 'commonjs' // IMPORTANT!
    }
  }
};