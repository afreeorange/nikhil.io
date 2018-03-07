const path = require('path');
const webpack = require('webpack');
const package = require('./package.json');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackBannerPlugin = require('html-webpack-banner-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const outputFolder = './dist';
const buildBanner = `\nWell aren\'t _you_ a curious little puppy?\n \
nikhil.io\n \
@version ${package.version}\n \
@built ${Date()}\n \
@link https://github.com/afreeorange/nikhil.io\n \
@author Nikhil Anand <mail@nikhil.io>\n`;

// Set up and configure plugins
const webpackPlugins = [
  new CleanWebpackPlugin([outputFolder]),
  new HtmlWebpackBannerPlugin({
      banner: buildBanner,
  }),
  new HTMLWebpackPlugin({
    template: './src/nikhil.io.html',
    favicon: './src/favicon.ico',
    minify: {
      collapseWhitespace: true,
      html5: true,
      minifyCSS: true,
      removeAttributeQuotes: true,
      removeComments: true,
      removeEmptyAttributes: true,
    },
  }),
  new ExtractTextPlugin('nikhil.io.css'),
  new StyleLintPlugin(),
  new webpack.BannerPlugin(buildBanner),
];
if (process.env.DEBUG) {
  webpackPlugins.push(new webpack.SourceMapDevToolPlugin());
} else {
  webpackPlugins.push(new UglifyJSPlugin());
}

module.exports = {
  entry: [
    './src/nikhil.io.js',
  ],
  module: {
    rules: [
      {
        test: /\.sass$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: true,
              },
            },
            'postcss-loader',
            'sass-loader',
          ],
        }),
      },
      // End CSS config

      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
          {
            loader: 'eslint-loader',
            options: {
              emitWarning: true,
            },
          },
        ],
      },
      // End JS config

      {
        test: /\.(jpe?g|png|ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
        use: 'base64-inline-loader',
      }, // End Asset config
    ],
  },
  output: {
    path: path.resolve(__dirname, outputFolder),
    publicPath: '/',
    filename: 'nikhil.io.js',
  },
  plugins: webpackPlugins,
  devServer: {
    contentBase: path.resolve(__dirname, outputFolder),
    compress: true,
    port: 9000,
  },
};
