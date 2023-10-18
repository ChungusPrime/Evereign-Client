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
        }),
    ],

    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, 'dist'),
    }

}
