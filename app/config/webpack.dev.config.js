const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.config.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')

module.exports = merge(common, {
    mode: 'development',
    devServer: { 
        static: path.join(__dirname, "dist"),
        compress: true,
        host: "127.0.0.1",
        port: 8081,
        open:true
    },
    plugins: [
        new HtmlWebpackPlugin({
        template: 'public/index.html',
        inject: 'body',
        hash: false,
        }),
        new NodePolyfillPlugin(),
    ]
});

