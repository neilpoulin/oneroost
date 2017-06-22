const webpack = require("webpack")
require("babel-polyfill")
var ProgressBarPlugin = require("progress-bar-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const extractCss = new ExtractTextPlugin({
    filename: "styles.css", allChunks: false
});
const path = require("path")

process.traceDeprecation = true

module.exports = {
    entry: {
        event: [
            "babel-polyfill",
            path.join(__dirname, "src", "chrome", "event", "index.js"),
        ],
        content: [
            "babel-polyfill",
            path.join(__dirname, "src", "chrome", "content", "index.jsx"),
            path.join(__dirname, "src", "chrome", "index.scss")
        ]
    },
    output: {
        path: path.join(__dirname, "chrome", "dist"),
        filename: "[name].js",
    },

    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.json$/,
                use: "json-loader"
            },
            {
                test: /\.js[x]?$/,
                exclude: /(node_modules)/,
                // include: [path.join(__dirname, "src")],
                loader: "babel-loader",
                options: {
                    presets: [
                        "react",
                        "es2015"
                        // "stage-3"
                    ],
                    // plugins: ["syntax-async-functions", "transform-async-to-generator", "jsx-display-if"]
                }
            },
            {
                test: /\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
                loader: "file-loader?name=fonts/[name].[ext]"
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        {
                            loader: "css-loader",
                            options: {sourceMap: true}
                        },
                        {
                            loader: "sass-loader",
                            options: {sourceMap: true, }
                        },
                        {
                            loader: "sass-resources-loader",
                            options: {
                                resources: "./src/scss/sass-resources.scss",
                                sourceMap: true,
                            }
                        }
                    ]
                })
            }
        ],
    },
    plugins: [
        extractCss,
        new ProgressBarPlugin(),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            Tether: "tether",
        }),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.DefinePlugin({"process.env": {NODE_ENV: JSON.stringify("production")}}),
        new webpack.optimize.UglifyJsPlugin({sourceMap: true}),
        new OptimizeCssAssetsPlugin()
    ],
    resolve: {
        extensions: [".js", ".jsx", ".json", ".sass", ".scss"],
        modules: ["chrome", "jsx", "events", "content", "components", "atoms", "node_modules"]
    },
    context: __dirname
};
