const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackBar = require('webpackbar');
const { isDev, PROJECT_PATH } = require('./constant');
const path = require('path');

module.exports = {
    entry: {
        index: resolve(PROJECT_PATH, './src/index.tsx')
    },
    output: {
        filename: `js/[name]${isDev ? ' ' : '.[hash:8]'}.js`,
        path: resolve(PROJECT_PATH, './dist'),
        publicPath: '/'
    },
    optimization: {},
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.json'], // webpack 会按照定义的后缀名的顺序依次处理文件
        alias: {
            Src: resolve(PROJECT_PATH, './src'),
            Components: resolve(PROJECT_PATH, './src/components'),
            Utils: resolve(PROJECT_PATH, './src/utils')
        }
    },
    module: {
        rules: [{
                oneOf: [{
                        test: /\.css$/,
                        use: [
                            isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
                            {
                                loader: 'css-loader',
                                options: {
                                    modules: false, // 默认就是 false
                                    sourceMap: isDev, // 开启后与 devtool 设置一致, 开发环境开启，生产环境关闭
                                    importLoaders: 0 // 指定在 CSS loader 处理前使用的 laoder 数量
                                }
                            }
                        ]
                    },
                    {
                        // 定义一下，使用 xxx.module.（less|css)
                        test: /.module.(less|css)$/,
                        include: [path.resolve(__dirname, '../src')],
                        use: [
                            // 我们一般情况下，在开发环境中，我们用 'style-loader', 方便我们做热更新。
                            // 生产环境下，我们要放在单独的文件里。
                            !isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
                            {
                                loader: 'css-loader',
                                options: {
                                    importLoaders: 2,
                                    modules: {
                                        localIdentName: '[path][name]__[local]--[hash:base64:4]'
                                    }
                                }
                            },
                            'postcss-loader',
                            'less-loader'
                        ]
                    },
                    {
                        test: /\.less$/,
                        use: [
                            isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
                            {
                                loader: 'css-loader',
                                options: {
                                    modules: false,
                                    sourceMap: isDev,
                                    importLoaders: 1 // 需要先被 less-loader 处理，所以这里设置为 1
                                }
                            },
                            {
                                loader: 'less-loader',
                                options: {
                                    sourceMap: isDev
                                }
                            }
                        ]
                    }
                ]
            },
            {
                test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 10 * 1024,
                        name: '[name].[contenthash:8].[ext]',
                        outputPath: 'assets/images'
                    }
                }]
            },
            {
                test: /\.(ttf|woff|woff2|eot|otf)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        name: '[name].[contenthash:8].[ext]',
                        outputPath: 'assets/fonts'
                    }
                }]
            },
            {
                test: /\.(tsx?|js)$/,
                loader: 'babel-loader',
                options: { cacheDirectory: true },
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin(),
        new CopyWebpackPlugin({
            patterns: [{
                context: resolve(PROJECT_PATH, './public'),
                from: '*',
                to: resolve(PROJECT_PATH, './dist'),
                toType: 'dir',
                globOptions: {
                    dot: true,
                    gitignore: true,
                    ignore: ['**/index.html']
                }
            }]
        }),
        new HtmlWebpackPlugin({
            template: resolve(PROJECT_PATH, './public/index.html'),
            filename: 'index.html',
            cache: false, // 特别重要：防止之后使用v6版本 copy-webpack-plugin 时代码修改一刷新页面为空问题。
            minify: isDev ?
                false :
                {
                    removeAttributeQuotes: true,
                    collapseWhitespace: true,
                    removeComments: true,
                    collapseBooleanAttributes: true,
                    collapseInlineTagWhitespace: true,
                    removeRedundantAttributes: true,
                    removeScriptTypeAttributes: true,
                    removeStyleLinkTypeAttributes: true,
                    minifyCSS: true,
                    minifyJS: true,
                    minifyURLs: true,
                    useShortDoctype: true
                }
        }),
        new WebpackBar({
            name: isDev ? 'run' : 'build',
            color: isDev ? '#00b2a9' : '#ee6139'
        }),
        new ForkTsCheckerWebpackPlugin({
            typescript: {
                configFile: resolve(PROJECT_PATH, './tsconfig.json')
            }
        })
    ]
};