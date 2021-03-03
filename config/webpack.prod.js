const { merge } = require('webpack-merge');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

const CommonConfig = require('./webpack.common.js');

module.exports = merge(CommonConfig, {

    mode: 'production',

    output: {
        filename: `${global.config.id || "myplugin"}.user.js`,
        path: path.resolve(__dirname, '../dist')
    },

    plugins: [


    ],

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                enforce: 'pre',
                exclude: /(node_modules|\.spec\.js)/,
                use: [{
                    loader: 'webpack-strip-block',
                    options: {
                        start: 'DEBUG-START',
                        end: 'DEBUG-END'
                    }
                }]
            },
        ]
    },

    optimization: {
        minimize: !!global.config.minimize,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    mangle: false,
                    compress: {
                        drop_console: true
                    },
                    output: {
                        beautify: !!global.config.beautify
                    }
                    // ecma: undefined,
                        // parse: {},
                        // compress: {},
                        // mangle: true, // Note `mangle.properties` is `false` by default.
                        // module: false,
                        // // Deprecated
                        // output: null,
                        // format: null,
                        // toplevel: false,
                        // nameCache: null,
                        // ie8: false,
                        // keep_classnames: undefined,
                        // keep_fnames: false,
                        // safari10: false,

                }
            })
        ]
    }
});
