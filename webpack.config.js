const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

const isDev = process.env.NODE_ENV == 'dev';

let config = {
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
    output: {
        path: path.resolve(__dirname, "./dist"),
        filename: "static/js/[name].[hash:5].js",
        publicPath: "./"
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: isDev ? '"development"' : '"production"'
            }
        }),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            filename: path.resolve(__dirname, './dist/index.html'),
            template: './src/pages/index.html',
            favicon: '',
            minify: {
                minimize: true,                 //打包为最小值
                // removeAttributeQuotes: true,    //去除引号
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
        new CopyPlugin([
            {
                from: path.resolve(__dirname, "./static"),
                to: './static'
            },
        ]),
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
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true
                        }
                    }
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
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true,
                        }
                    },
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
if (isDev) {
    config.devtool = "#cheap-module-eval-source-map";
    config.devServer = {
        contentBase: path.resolve(__dirname, './dist'),
        host: '0.0.0.0',
        port: 3737,
        hot: true,
        publicPath: '/'
    }
    config.plugins.push(
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin()
    )
} else {
    config.output.filename = 'static/js/[name].[chunkhash:5].js';
    new webpack.optimize.CommonsChunkPlugin({
        name: 'runtime'
    })
    // config.optimization = {
    //     splitChunks: {
    //         cacheGroups: {
    //             commons: {
    //                 name: "commons",
    //                 chunks: "initial",
    //                 minChunks: 2
    //             }
    //         }
    //     }
    // }
}

module.exports = config