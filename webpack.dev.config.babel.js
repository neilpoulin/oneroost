const webpack = require("webpack")
require("babel-polyfill")
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
        publicPath: "http://dev.oneroost.com/static/bundle",
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
                exclude: /(node_modules|bower_components|cloud|build)/,
                // include: [path.join(__dirname, paths.src_jsx)],
                loaders: ["react-hot-loader", "babel-loader?presets[]=react,presets[]=es2015", "webpack-module-hot-accept"],
            },
            {
                test: /\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
                loader: "file-loader?name=fonts/[name].[ext]"
            },
            {
                test: /\.scss$/,
                    use: [
                        {
                            loader: "style-loader"
                        },
                        {
                            loader: "css-loader",
                            options: {
                                sourceMap: true
                            }
                        },
                        {
                            loader: "sass-loader",
                            options: {
                                sourceMap: true,
                            }
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
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
    ],
    resolve: {
        extensions: [".js", ".jsx", ".json", ".scss", ".css"],
        modules: ["jsx", "modules", "ducks", "util", "admin", "payment", "deal", "form", "modules/dashboard", "navigation", "node_modules", "models", "actions", "reducers", "store", "middleware", "version"],
    },
};
