const { merge } = require('webpack-merge');
const baseConfig = require('@ttt/build/base.webpack.config');

module.exports = merge(baseConfig, {
  entry: {
    'connect': './src/connect/index.ts',
    'create': './src/create/index.ts' 
  }
});