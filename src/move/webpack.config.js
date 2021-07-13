const { merge } = require('webpack-merge');
const baseConfig = require('@ttt/build/base.webpack.config');

module.exports = merge(baseConfig, {
  entry: {
    'connect': './src/move/index.ts'
  }
});