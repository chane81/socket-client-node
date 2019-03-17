const withCSS = require('@zeit/next-css')
const withSass = require('@zeit/next-sass')
const withTypescript = require('@zeit/next-typescript')
const path = require('path')
const dotEnv = require('dotenv-webpack')

module.exports = 
withTypescript(
  withSass(
      withCSS({
        webpack: function (config) {
          const originalEntry = config.entry

          config.plugins = config.plugins || []

          config.plugins = [
            ...config.plugins,

            // .env 관련 설정
            new dotEnv({
              path: path.join(__dirname, '.env'),
              systemvars: true
            })
          ];

          config.entry = async () => {
            const entries = await originalEntry()

            if (
              entries['main.js'] &&
              !entries['main.js'].includes('./polyfills.js')
            ) {
              entries['main.js'].unshift('./polyfills.js');
            }

            return entries
          }

          return config
        }
    })
  )
);
