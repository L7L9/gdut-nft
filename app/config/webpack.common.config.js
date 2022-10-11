const path = require('path');


module.exports = {
    entry: {
    index:"./src/index.js",
    bundle:"./src/bundle.js",
    pouchdbFind:"./src/pouchdb.find.js"
    },
    output: {
    filename: "[name].js",
        path: path.resolve(__dirname, "dist"),
        publicPath:'/'
    },
    module: {
        rules: [
            {
            test: /\.(js|jsx)$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader',
                options: {
                presets: ['@babel/preset-env', '@babel/preset-react'],
                plugins: [
                    '@babel/plugin-transform-runtime',
                    '@babel/plugin-proposal-class-properties',
                ],
                },
            },
            },
            {
                test: /\.(css|less)$/,
                use: [
                    { loader: "style-loader" },
                    { loader: "css-loader" },
                    {
                        loader: "less-loader",
                        options: {
                        lessOptions: {
                            javascriptEnabled: true,
                        },
                        },
                    },
                    ],
                },
        ],
    },
    resolve: {
        extensions: ['.js','.jsx','.json'],   // 改变引入文件， 可以不写后缀名
        alias: {							// 配置 import 相对路径引入的文件or图片
            '@': '/src'
        }
    },
};

