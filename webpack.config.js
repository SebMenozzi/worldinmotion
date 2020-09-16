const path = require('path')
const webpack = require('webpack')
const webpackTargetElectronRenderer = require('webpack-target-electron-renderer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const ASSET_PATH = process.env.ASSET_PATH || '/assets';

const config = [
  {
    entry: {
      app: [
        "./scripts/index.js",
        "./styles/index.scss"
      ]
    },
    output: {
      path: path.resolve(__dirname, "static"),
      filename: 'js/app.min.js',
      publicPath: 'static/'
    },
    resolve: {
      modules: ["node_modules", __dirname],
      extensions: [".js", ".json"]
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          include: path.resolve(__dirname, "scripts"),
          use: [
            { loader: 'babel-loader' }
          ]
        },
        {
          test: /\.(scss|sass|css)$/,
          include: path.resolve(__dirname, "styles"),
          use: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: [
              { loader: 'css-loader', options: { minimize: true } },
              { loader: 'sass-loader' }
            ]
          })
        },
        {
          test: /\.json/,
          include: path.resolve(__dirname, "assets/data"),
          loader: 'json-loader',
        },
      ]
    },
    plugins: [
      new ExtractTextPlugin({
        filename: "css/app.min.css"
      })
    ]
  }
]

module.exports = config
