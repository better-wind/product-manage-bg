// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    productionSourceMap: true,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: require('./dev.env'),
    port: 8099,
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/goodsAdmin': {
        target: 'http://114.215.198.55:9004',
        // target: 'http://121.43.35.4:8080',
        // target: 'http://192.168.1.220:9982',
        // target: 'http://192.168.1.117:9982',
        changeOrigin: true,
        pathRewrite: {
          '^/goodsAdmin': ''
        },
        headers: {
          // 'Cookie':'JSESSIONID=4C7EC0D95F89DA0BB1D70520673C0452',
        },
      },
      '/mock/11': {
        target: 'http://192.168.1.188:3000',
        // target: 'http://192.168.1.117:9982',
        // target: 'http://192.168.0.132:9982',
        changeOrigin: true,
        pathRewrite: {
          '^/mock/11': '/mock/11'
        },
        headers: {
          // 'Cookie':'JSESSIONID=4C7EC0D95F89DA0BB1D70520673C0452',
        },
      },
    },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}
