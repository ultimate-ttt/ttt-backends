// https://dev.to/dnasir/azure-functions-node-js-typescript-webpack-a3m
// https://prateeksurana.me/blog/using-environment-variables-with-webpack/
const path = require('path');

// TODO base webpack.config ?
module.exports = {
  target: 'node', // IMPORTANT!
  entry: {
    'create': './create/index.ts' 
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
  },
  output: {
    filename: '[name]/index.js',
    path: path.resolve(__dirname, 'dist'), // TODO maybe change this when az function stuff is cleared up
    library: {
      // maybe change to module when it's not experimental anymore in webpack
      type: 'commonjs' // IMPORTANT!
    }
  }
};