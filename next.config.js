const isProd = process.env.NODE_ENV === 'production'
const envFileName = isProd ? '.env' : '.env.' + process.env.NODE_ENV
// const withCSS = require('@zeit/next-css')
require('dotenv').config({ path: envFileName })
const basePath = process.env.BASE_PATH ? process.env.BASE_PATH : ''

module.exports = {
  // basePath: basePath,
  webpack(webpackConfig) {
    return {
      ...webpackConfig,
      optimization: {
        minimize: false,
      },
    }
  },
  trailingSlash: true,
  env: {},
  publicRuntimeConfig: {
    apiUrl: process.env.API_URL,
    basePath: basePath,
    domainName: process.env.DOMAIN_NAME,
    apiKey: process.env.API_KEY,
    loggerToken: process.env.LOGGER_AUTH_TOKEN,
    isLocal: process.env.LOCAL || false,
  },
}
