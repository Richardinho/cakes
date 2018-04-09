const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin');

const path = require('path');

module.exports = {
  entry:{
    'index': './src/index.js',
  },

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },

  devtool: 'source-map',

  devServer: {
    contentBase: './dist',
    historyApiFallback: true
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader'},
          { 
            loader: 'css-loader', 
            options: {
              modules: true,
              camelCase: true,
            }
          },
        ]
      },
      {
        test: /\.js/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
    ]
  },

  resolve: {
    symlinks: false 
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: 'Waracle',
      template: 'index.html',
    }),
    new webpack.NamedModulesPlugin(),
    new ServiceWorkerWebpackPlugin({
      entry: path.join(__dirname, 'src/service-worker.js'),
    })
  ],
}
