const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  target: ['node10'],
  plugins: [
    new webpack.BannerPlugin({ banner: "#!/usr/bin/env node", raw: true }),
  ],
  output: {
    filename: 'error-report-only.sh',
    path: path.resolve(__dirname, 'dist'),
  }
};
