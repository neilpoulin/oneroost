const webpack = require("webpack")
// const HappyPack = require("happypack")
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
        sourceMapFilename: "[name].js.map",
        publicPath: "http://dev.oneroost.com/static/bundle",
    },
    devtool: "eval",
    module: {
        rules: [
            {
                test: /\.json$/,
                use: "json-loader"
            },
            // {
            //     test: /\.js[x]?$/,
            //     exclude: /(node_modules|bower_components|cloud|build)/,
            //     loaders: [ "happypack/loader" ],
            // },
            {
                test: /\.js[x]?$/,
                exclude: /(node_modules|cloud|build)/,
                // include: [path.join(process.cwd(), "src", "jsx")],
                // loaders: ["react-hot-loader", "babel-loader?presets[]=react,presets[]=es2015", "webpack-module-hot-accept"],
                use: [
                    {loader: "react-hot-loader"},
                    {loader: "webpack-module-hot-accept"},
                    {
                        loader: "babel-loader",
                        options: {
                            cacheDirectory: true,
                            presets: [
                                "react",
                                "es2015"
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
                test: /\.scss$/,
                use: [
                        {loader: "style-loader"},
                        {
                            loader: "css-loader",
                            options: {sourceMap: false, }
                        },
                        {
                            loader: "sass-loader",
                            options: {sourceMap: false, }
                        },
                        {
                            loader: "sass-resources-loader",
                            options: {
                                resources: "./src/scss/sass-resources.scss",
                                sourceMap: false,
                            }
                        }
                ]

            }
        ],
    },

    plugins: [
        // new HappyPack({
        //     // loaders is the only required parameter:
        //     loaders: ["react-hot-loader", "babel-loader?presets[]=react,presets[]=es2015", "webpack-module-hot-accept"],
        //
        //     // customize as needed, see Configuration below
        //     threads: 4,
        //     cache: true,
        // }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            Tether: "tether",
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        // new webpack.PrefetchPlugin("/node_modules/sass-resources-loader/lib/loader.js"),
        // new webpack.PrefetchPlugin(path.join(__dirname, "src", "scss"), "index.scss"),
        // new webpack.PrefetchPlugin("/node_modules/sass-loader/lib/loader.js"),
        // new webpack.PrefetchPlugin(path.join(__dirname, "src", "scss"), "sass-resources.scss"),

    ],
    resolve: {
        extensions: [".js", ".jsx", ".json", ".scss", ".css"],
        modules: ["jsx", "modules", "ducks", "util", "admin", "brand", "settings", "payment", "deal", "form", "modules/dashboard", "navigation", "node_modules", "models", "actions", "reducers", "store", "middleware", "version"],
    },
};
