const path = require('path');
const webpack = require('webpack');
const ESLintPlugin = require('eslint-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');

const baseConfig = require('./webpack.base');
const pk = require('./package.json');

const env = String(process.env.NODE_ENV || 'development').toLowerCase();
const version = String(pk.version) || '0.0.1';

// Define Plugin
const pluginDefinePlugin = new webpack.DefinePlugin({
  'process.env.NODE_ENV': JSON.stringify(env),
  'process.env.VERSION': JSON.stringify(version)
});

// ESLint Options
const pluginDefineESLint = new ESLintPlugin({
  failOnWarning: false,
  failOnError: false
});

// Define Plugin Vue
const pluginDefineVue = new VueLoaderPlugin();

const plugins = [
  pluginDefinePlugin,
  pluginDefineESLint,
  pluginDefineVue
];

const config = Object.assign(baseConfig, {
  entry: {
    sdk: './sdk/index.js',
    main: './sdk/main.js',
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
