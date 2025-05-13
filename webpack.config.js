const path = require('path');

module.exports = {
  // ... tes autres configurations ...
  resolve: {
    fallback: {
      "http": require.resolve("stream-http"),
      "https": require.resolve("https-browserify"),
      "stream": require.resolve("stream-browserify"),
      "util": require.resolve("util/"),
      "zlib": require.resolve("browserify-zlib"),
      "url": require.resolve("url/"),
      "assert": require.resolve("assert/")
    }
  },
  devServer: {
    setupMiddlewares: (middlewares, devServer) => {
      // Tu peux ajouter ici des middlewares personnalisés si besoin
      return middlewares;
    }
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
        exclude: [
          /node_modules\/@mediapipe\/tasks-vision/
        ],
      },
    ],
  }
};
