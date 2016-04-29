var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var isDev = process.env.npm_lifecycle_event === 'start';

var entry = [ __dirname + '/src/ajliv.js' ];
if (isDev) entry.unshift('webpack-dev-server/client');

var plugins = [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
        'process.env': { 'NODE_ENV': JSON.stringify('production') }
    }),
    new webpack.optimize.UglifyJsPlugin({
        compressor: { warnings: false }
    }),
    new ExtractTextPlugin('ajliv.css')
];
if (isDev) plugins.push(new webpack.HotModuleReplacementPlugin());


module.exports = {
    entry: entry,

    output: {
        path: __dirname + '/dist/assets',
        filename: 'ajliv.js',
        publicPath: '/assets'
    },

    devServer: isDev ? {
        contentBase: __dirname + '/src',
        historyApiFallback: true,
        hot: true,
        inline: true,
        progress: true,
        stats: 'errors-only',
        host: process.env.HOST,
        port: process.env.PORT
    } : null,

    resolve: [
        '',
        '.js'
    ],

    module: {
        loaders: [
            {
                test: /\.less$/,
                loader: isDev ? 'style!css!postcss!less' : ExtractTextPlugin.extract('style', 'css!postcss!less')
            },
            {
                test: /\.css$/,
                loader: isDev ? 'style!css!postcss' : ExtractTextPlugin.extract('style', 'css!postcss')
            },
            {
                test: /\.jsx*$/,
                exclude: /node_modules/,
                loader: 'babel',
            }
        ]
    },

    plugins: plugins,

    postcss: function() {
        return [
            require('autoprefixer')({ browsers: [ 'last 2 versions' ] })
        ];
    }
};
