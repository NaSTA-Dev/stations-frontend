const path = require('path')
const webpack = require('webpack')
const CONFIG = require('./webpack.base')

const { CLIENT_ENTRY, CLIENT_OUTPUT, PUBLIC_PATH } = CONFIG

module.exports = {
  devtool: 'eval',
  entry: {
    main: [
      'webpack/hot/only-dev-server',
      'webpack-hot-middleware/client',
      CLIENT_ENTRY
    ],
    vendor: [
      'react',
      'react-dom',
      'react-router',
      'alt'
    ]
  },
  output: {
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
    publicPath: '/',
    path: CLIENT_OUTPUT
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel',
        exclude: /(node_modules|server)/,
        query: {
          cacheDirectory: true,
          presets: ["es2015", "react", "stage-0"]
        }
      },
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
      '__DEV__': true
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js', 2),
    new webpack.NoErrorsPlugin()
  ],
}