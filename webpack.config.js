const webpack = require('webpack');
const path = require('path');
const package = require('./package.json');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const sassLintPlugin = require('sasslint-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

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
    rules: [
      {
        test: /\.pug$/,
        use: ['pug-loader']
      },
      {
        test: /\.sass$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader']
        })
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      },
      {
        test: /\.(woff|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: 'base64-font-loader'
      }
    ]
  },
  externals: [
    'canvas',
    'fs'
  ],
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),
    new HtmlWebpackPlugin({
      title: 'Nikhil Anand, Des Moines, Iowa',
      template: path.resolve(__dirname, 'src/nikhil.io.pug')
    }),
    new webpack.BannerPlugin(headerMessage),
    new sassLintPlugin({
      configFile: '.sass-lint.yml',
      glob: 'src/*.s?(a|c)ss'
    }),
    new UglifyJSPlugin({
      comments: false
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NIKHIL_IO_INSTAGRAM_TOKEN': JSON.stringify(process.env.NIKHIL_IO_INSTAGRAM_TOKEN),
        'NIKHIL_IO_GA_TOKEN': JSON.stringify(process.env.NIKHIL_IO_GA_TOKEN),
        'NIKHIL_IO_INSTAGRAM_UID': JSON.stringify(process.env.NIKHIL_IO_INSTAGRAM_UID)
      }
    }),
    new ExtractTextPlugin('nikhil.io.css')
  ]
}
