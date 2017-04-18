const webpack = require("webpack")
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const extractCss = new ExtractTextPlugin("style-bundle.css");
const path = require("path")

const outputDir = "dist";
const indexFile = path.join("src", "scss", "index.scss")

process.traceDeprecation = true

module.exports = {
    entry: {
        styles: [
            // "bootstrap-loader",
            path.join(__dirname, indexFile)
        ]
    },
    // context: path.join(__dirname, "src", "jsx"),
    output: {
        path: path.join(__dirname, outputDir),
        filename: "[name].css",
        // publicPath: path.join(__dirname, outputDir),
    },
    module: {
        rules: [
            {
                test: /\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
                loader: "file-loader?name=fonts/[name].[ext]"
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        // {
                        //     loader: "style-loader"
                        // },
                        // {
                        //     loader: "postcss-loader",
                        //     options: {}
                        // },
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
                })
            }],
    },
    plugins: [
            extractCss,
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery",
                Tether: "tether",
            }),
    ],
    resolve: {
        extensions: [".scss", ".css"],
        modules: ["scss", "node_modules"],
    },
};
