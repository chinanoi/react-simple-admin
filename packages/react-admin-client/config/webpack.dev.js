const { merge } = require('webpack-merge');
const common = require('./webpack.common');
const { SERVER_HOST, SERVER_PORT } = require('./constant');
const proxy = require('http-proxy-middleware');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'cheap-module-source-map',
    devServer: {
        host: SERVER_HOST, // 指定 host，不设置的话默认是 localhost
        port: SERVER_PORT, // 指定端口，默认是8080
        compress: true, // 是否启用 gzip 压缩
        open: true, // 打开默认浏览器
        hot: true, // 热更新
        // client: {
        //     overlay: true,
        //     logging: 'info', // 替代了原先的 clientLogLevel和status
        //   },
        historyApiFallback: true,
        proxy: {
            '/api': {
                target: 'http://localhost:3000', // 设置代理目标
                changeOrigin: true, // 改变请求源
                pathRewrite: {
                    '^/api': '' // 将 /api 前缀替换为空字符串
                }
            }
        }
    }
});