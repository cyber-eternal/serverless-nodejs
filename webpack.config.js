// webpack.config.js
const path = require('path');
const slsw = require('serverless-webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: slsw.lib.entries,
  target: 'node',
  externals: [nodeExternals({
    modulesFromFile: true
  })],
  module: {
    rules: [
      {
        test: /\.jql$/,
        exclude: /node_modules/,
        use: ['jql-loader', 'babel-loader']
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: ['shebang-loader', 'babel-loader']
      },
      {
        test: /\.json$/,
        use: ['json-loader']
      }
    ]
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js'
  },
  plugins: [
  ]
};