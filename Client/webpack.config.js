const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    devtool: "source-map",
    entry: {
        evereign: './src/main.ts'
    },
    module: {
        rules: [
            { 
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif|html|mp3)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.json$/i,
                exclude: [path.resolve(__dirname, 'AbilityData.json'), path.resolve(__dirname, 'ItemData.json')],
                type: 'asset/resource',
            },
            {
                test: /AbilityData\.json$/,
                type: 'asset/source',
            },
            {
                test: /ItemData\.json$/,
                type: 'asset/source',
            },
            {
                test: /\.s[ac]ss$/i,
                use: [ MiniCssExtractPlugin.loader, "css-loader", "sass-loader", ],
            },
            {
                test: /\\.(png|jp(e*)g|svg|gif)$/,
                use: ['file-loader'],
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
        new HtmlWebpackPlugin({
          title: 'Evereign',
          filename: './index.html',
          template: './src/index.ejs'
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css',
        })
    ],
    output: {
        //filename: '[name].[contenthash].js',
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true
    }
}
