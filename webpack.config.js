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
                exclude: [
                    path.resolve(__dirname, 'game_classes.json'),
                    path.resolve(__dirname, 'game_races.json')
                ],
                type: 'asset/resource',
            },
            {
                test: /game_classes\.json$/,
                type: 'asset/source',
            },
            {
                test: /game_races\.json$/,
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
