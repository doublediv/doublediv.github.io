const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = {
    entry: {
        app: "./src/main.js",
    },
    devtool: 'inline-source-map',
    resolve: {
        extensions: ['.js', '.json'],
        alias: {
            '@src': resolve('src'),
        }
    },
    devServer: {
        contentBase: path.resolve(__dirname, './dist'),
        host: '0.0.0.0',
        port: 3737,
        hot: true,
        publicPath: '/'
    },
    output: {
        path: path.resolve(__dirname, "./dist"),
        filename: "static/js/[name].[hash:5].js",
        chunkFilename: "static/js/[id].[hash:5].js",
        publicPath: "./"
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            filename: path.resolve(__dirname, './dist/index.html'),
            template: './src/pages/index.html',
            favicon: '',
            minify: {
                minimize: true,                 //打包为最小值
                removeAttributeQuotes: true,    //去除引号
                removeComments: true,           //去除注释
                // collapseWhitespace: true,       //去除空格
                minifyCSS: true,                //压缩html内css
                minifyJS: true,                 //压缩html内js
                // removeEmptyElements: true,      //清除内存为空的元素
            },
            hash: true
        }),
        new MiniCssExtractPlugin({
            filename: "static/css/layout.[hash:5].css",
            chunkFilename: "static/css/[id].[hash:5].css",
            publicPath: '../'
        }),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.html$/,
                loader: "underscore-template-loader"
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '../../'
                        }
                    },
                    "css-loader",
                    "postcss-loader"

                ]
            },
            {
                test: /\.less$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '../../'
                        }
                    },
                    'css-loader',
                    "postcss-loader",
                    'less-loader'
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            limit: 10000,
                            name: path.posix.join("static", 'images/[name].[hash:7].[ext]')
                        }
                    }
                ]
            },
            {
                test: /\.(csv|tsv)$/,
                loader: 'csv-loader'
            },
            {
                test: /\.xml$/,
                loader: 'xml-loader'
            }
        ]
    }
};