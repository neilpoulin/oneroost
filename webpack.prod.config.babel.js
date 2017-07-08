const webpack = require("webpack")
require("babel-polyfill")
const path = require("path")
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const ProgressBarPlugin = require("progress-bar-webpack-plugin");
const extractCss = new ExtractTextPlugin({
    filename: "styles.css", allChunks: false
});

process.traceDeprecation = true

module.exports = {
    entry: {
        // style: [path.join(__dirname, "src", "scss", "index.scss")],
        scripts: [
            "babel-polyfill",
            path.join(__dirname, "src", "jsx", "index.jsx"),
            path.join(__dirname, "src", "scss", "index.scss")
        ]
    },
    output: {
        path: path.join(__dirname, "/public/bundle"),
        filename: "[name].js",
        // publicPath: "http://dev.oneroost.com/static/bundle",
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
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            "react",
                            "es2015"
                        ]
                    }
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
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            Tether: "tether",
        }),
        new ProgressBarPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.DefinePlugin({"process.env": {NODE_ENV: JSON.stringify("production")}}),
        new webpack.optimize.UglifyJsPlugin({sourceMap: true}),
        new OptimizeCssAssetsPlugin()
    ],
    resolve: {
        extensions: [".js", ".jsx", ".json", ".scss", ".css", ".sass"],
        modules: ["jsx", "modules", "ducks", "util", "admin", "brand", "settings", "payment", "deal", "atom", "form", "modules/dashboard", "navigation", "node_modules", "models", "actions", "reducers", "store", "middleware", "email", "template", "version"],
    },
};
