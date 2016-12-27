const webpack = require('webpack');
const path = require('path');
const package = require('./package.json');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const sassLintPlugin = require('sasslint-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const headerMessage = `Well aren\'t _you_ a curious little kitten?\n \
nikhil.io\n \
@version ${package.version}\n \
@built ${Date()}\n \
@link https://github.com/afreeorange/nikhil.io\n \
@author Nikhil Anand <mail@nikhil.io>`;

module.exports = {
  entry: path.resolve(__dirname, 'src/nikhil.io.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'nikhil.io.js',
    publicPath: '/'
  },
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint'
      }
    ],
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {presets: ['es2015']}
      },
      {test: /\.(pug|jade)$/, loader: 'pug'},
      {test: /\.sass$/, loader: ExtractTextPlugin.extract('style', 'css!sass')},
      {test: /\.(woff|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'base64-font'}
    ]
  },
  externals: [
    'canvas',
    'fs'
  ],
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Nikhil Anand, Des Moines, Iowa',
      template: path.resolve(__dirname, 'src/nikhil.io.pug')
    }),
    new sassLintPlugin({
      configFile: '.sass-lint.yml',
      glob: 'src/*.s?(a|c)ss'
    }),
    new webpack.optimize.UglifyJsPlugin({
      comments: false
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),
    new webpack.BannerPlugin(headerMessage),
    new webpack.DefinePlugin({
      'process.env': {
        'NIKHIL_IO_INSTAGRAM_TOKEN': JSON.stringify(process.env.NIKHIL_IO_INSTAGRAM_TOKEN),
        'NIKHIL_IO_GA_TOKEN': JSON.stringify(process.env.NIKHIL_IO_GA_TOKEN),
        'NIKHIL_IO_INSTAGRAM_UID': JSON.stringify(process.env.NIKHIL_IO_INSTAGRAM_UID)
      }
    }),
    new ExtractTextPlugin('nikhil.io.css')
  ]
};
