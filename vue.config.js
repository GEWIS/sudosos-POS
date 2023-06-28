const webpack = require('webpack');

module.exports = {
  css: {
    loaderOptions: {
      scss: {
        additionalData: '@import "~@/styles/global/_variables.scss";',
      },
    },
  },
  devServer: {
    proxy: {
      '^/v1': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '^/static': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          VUE_APP_BUILD_HASH: JSON.stringify(require('child_process')
            .execSync('git rev-parse --short HEAD')
            .toString()
            .trim()),
        },
      }),
    ],
  },
};
