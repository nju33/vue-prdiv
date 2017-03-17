import HtmlWebpackPlugin from 'html-webpack-plugin';

export default {
  entry: './example/src/index.js',
  output: {
    path: `${__dirname}/example/dist`,
    filename: 'index.js'
  },
  resolve: {
    extensions: ['.js', '.json', '.vue'],
    alias: {
      components: `${__dirname}/components/`
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin()
  ]
};
