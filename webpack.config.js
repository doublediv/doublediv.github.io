const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

// function resolve(dir) {
//     return path.join(__dirname, '..', dir)
// }
function resolve(dir) {
    return path.resolve(__dirname, dir)
}

const isDev = process.env.NODE_ENV == 'dev';

function pagePack(name, title) {
    return new HtmlWebpackPlugin({
        filename: resolve(`./dist/${name}.html`),
        template: `./src/pages/${name}.html`,
        // favicon: './favicon.ico',
        title: `dobuleDiv-${title}`,
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
    })
}

let config = {
    entry: {
        app: resolve("./src/main.js"),
        // contact: resolve("./src/entry/contact.js"),
    },
    devtool: 'inline-source-map',
    resolve: {
        extensions: ['.js', '.json'],
        alias: {
            '@src': resolve('./src'), //不起作用
        }
    },
    output: {
        path: resolve("./dist"),
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
        pagePack('index', '首页'),
        pagePack('contact', '联系'),
        new MiniCssExtractPlugin({
            filename: "static/css/layout.[hash:5].css",
            chunkFilename: "static/css/[id].[hash:5].css",
            publicPath: '../'
        }),
        new CopyPlugin([
            {
                from: resolve("./static"),
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
                            publicPath: '../../',
                            hmr: isDev,
                            reloadAll: true
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
                            publicPath: '../../',
                            hmr: isDev,
                            reloadAll: true
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
        contentBase: resolve('./dist'),
        host: '0.0.0.0',
        port: 3333,
        hot: true,
        publicPath: '/'
    }
    config.plugins.concat([
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin()
    ]);
} else {
    config.output.filename = 'static/js/[name].[chunkhash:5].js';
    // new webpack.optimize.CommonsChunkPlugin({
    //     name: 'runtime'
    // })
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