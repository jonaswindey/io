var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var StatsWriterPlugin = require("webpack-stats-plugin").StatsWriterPlugin;

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    'babel-polyfill',
    'webpack-hot-middleware/client',
    './lib/index'
  ],
  output: {
    filename: 'app.js',
    path: path.join(__dirname, 'dist'),
    publicPath: '/assets/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('development'),
      },
      '__DEVTOOLS__': process.env.DEVTOOLS === 'true' ? true : false
    }),
    new HtmlWebpackPlugin({
      title: '3nit.io',
      filename: 'index.html',
      template: 'index.template.html',
      favicon: path.join(__dirname, 'assets', 'images', 'favicon.ico'),
      build: new Date(),
    }),
    new StatsWriterPlugin({
      filename: "stats.json"
    })
  ],
  module: {
    loaders: [
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      { test: /\.jsx$/, loader: 'babel', include: path.join(__dirname, 'lib') },
      { test: /\.js$/, loader: 'babel', include: path.join(__dirname, 'lib') },
      { test: /\.scss$/, loader: 'style!css!sass'},
      { test: /\.(jpe?g|png|gif|svg|woff|woff2|eot|ttf)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url?limit=10000&name=[sha512:hash:base64:7].[ext]'},
      { test: /\.less$/, loader: "style!css!less" }
    ]
  }
};
