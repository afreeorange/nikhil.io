const webpack = require('webpack');
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

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
    new webpack.optimize.UglifyJsPlugin({
      comments: false
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    })
  ]
};
