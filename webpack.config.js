const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

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
            { 
              loader: 'babel-loader', 
              options: {
               presets: ['@babel/preset-env'],
              }, 
            }
          ]
        },
        {
          test: /\.css/,
          include: path.resolve(__dirname, "styles"),
          use: [
            "style-loader",
            "css-loader"
          ]
        },
        {
          test: /\.(scss|sass)$/,
          include: path.resolve(__dirname, "styles"),
          use: [
            "style-loader",
            "css-loader",
            "sass-loader"
          ]
        },
        {
          test: /\.json/,
          include: path.resolve(__dirname, "assets/data"),
          loader: 'json-loader',
        },
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: "css/app.min.css"
      })
    ]
  }
]

module.exports = config
