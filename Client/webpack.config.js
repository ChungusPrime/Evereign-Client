const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {

    mode: "development",

    watch: false,

    devtool: "source-map",

    entry: {
        evereign: './src/main.js'
    },

    plugins: [
        new HtmlWebpackPlugin({
          title: 'Evereign',
          filename: 'index.html',
          template: 'src/index.html'
        }),
    ],

    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, 'dist'),
        clean: true
    }

}
