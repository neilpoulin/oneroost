const webpack = require("webpack")
// const HappyPack = require("happypack")
require("babel-polyfill")
const ProgressBarPlugin = require("progress-bar-webpack-plugin");
const path = require("path")

process.traceDeprecation = true

module.exports = {
    entry: {
        scripts: [
            "webpack/hot/dev-server",
            "webpack-hot-middleware/client",
            "babel-polyfill",
            path.join(__dirname, "src/jsx", "index.jsx"),
            path.join(__dirname, "src", "scss", "index.scss")
        ]
    },
    output: {
        path: path.join(__dirname, "/public/bundle"),
        filename: "[name].js",
        sourceMapFilename: "[name].js.map",
        publicPath: "https://dev.oneroost.com/static/bundle",
    },
    devtool: "eval",
    module: {
        rules: [
            {
                test: /\.json$/,
                use: "json-loader"
            },
            {
                test: /\.js[x]?$/,
                exclude: /(node_modules|cloud|build)/,
                use: [
                    {loader: "react-hot-loader"},
                    {loader: "webpack-module-hot-accept"},
                    {
                        loader: "babel-loader",
                        options: {
                            cacheDirectory: true,
                            presets: [
                                "react",
                                "es2015",
                                "stage-0"
                            ]
                        }
                    },
                ]
            },
            {
                test: /\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
                loader: "file-loader?name=fonts/[name].[ext]"
            },
            {
                test: /\.(png|jpg|jpeg)/,
                loader: "file-loader?name=images/[name].[ext]"
            },
            {
                test: /\.scss$/,
                use: [
                        {loader: "style-loader"},
                        {
                            loader: "css-loader",
                            options: {sourceMap: true, }
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

            }
        ],
    },

    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            Tether: "tether",
        }),
        new ProgressBarPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    ],
    resolve: {
        extensions: [".js", ".jsx", ".json", ".scss", ".css", ".sass", ".png", ".jpg", ".jpeg"],
        modules: ["jsx", "modules", "ducks", "util", "admin", "brand", "settings", "payment", "deal", "atom", "form", "modules/dashboard", "navigation", "node_modules", "models", "actions", "reducers", "store", "middleware", "version"],
    },
};
