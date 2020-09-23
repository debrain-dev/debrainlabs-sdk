const path = require('path');
const webpack = require('webpack');
const baseConfig = require('./webpack.base');
const pk = require('./package.json');

const env = String(process.env.NODE_ENV || 'development').toLowerCase();
const version = String(pk.version) || '0.0.1';

// Define Plugin
const pluginDefinePlugin = new webpack.DefinePlugin({
  'process.env.NODE_ENV': JSON.stringify(env),
  'process.env.VERSION': JSON.stringify(version)
});

const plugins = [pluginDefinePlugin];

const config = Object.assign(baseConfig, {
  entry: {
    sdk: './sdk/js/index.js'
  },
  output: {
    path: path.resolve(process.cwd(), './public/'),
    filename: 'js/[name].js'
  },
  resolve: {
    modules: [
      './',
      './node_modules/'
    ]
  },
  devtool: env !== 'production' ? 'source-map' : undefined,
  plugins
});

module.exports = config;
