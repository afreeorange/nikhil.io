const webpack = require('webpack');
const path = require('path');
const package = require('./package.json');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const sassLintPlugin = require('sasslint-webpack-plugin');

const headerMessage = `Well aren\'t _you_ a curious little kitten?\n \
nikhil.io\n \
@version ${package.version}\n \
@built Mon Dec 19 2016 12:56:46 GMT-0600 (CST)\n \
@link https://github.com/afreeorange/nikhil.io\n \
@author Nikhil Anand <mail@nikhil.io>`;

module.exports = {
  entry: path.resolve(__dirname, 'src/nikhil.io.coffee'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'nikhil.io.js',
    publicPath: '/'
  },
  module: {
    loaders: [
      {test: /\.coffee$/, loader: 'coffee'},
      {test: /\.(pug|jade)$/, loader: 'pug'},
      {test: /\.sass$/, loader: 'style!css!sass'},
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
      $: "jquery",
      jQuery: "jquery"
    }),
    new webpack.BannerPlugin(headerMessage)
  ]
};
