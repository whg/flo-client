const webpack = require('webpack')
const analyzer = require('webpack-bundle-analyzer');
const PurgecssPlugin = require('purgecss-webpack-plugin');
const glob = require('glob-all');
const path = require('path');

process.env.VUE_APP_VERSION = process.env.npm_package_version

module.exports = {
  configureWebpack: {
    plugins: [
      // new analyzer.BundleAnalyzerPlugin(),
      new PurgecssPlugin({
        paths: glob.sync([
          path.join(__dirname, './src/index.html'),
          path.join(__dirname, './**/*.vue'),
          path.join(__dirname, './src/**/*.js')
        ])
      })
    ]
  }
}
