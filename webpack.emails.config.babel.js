const webpack = require("webpack")
const path = require("path")
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const extractCss = new ExtractTextPlugin("email-bundle.scss");
const ProgressBarPlugin = require("progress-bar-webpack-plugin");
process.traceDeprecation = true

const outputDir = path.join("build", "node", "email", "template", "style")

module.exports = {
    entry: [
        path.join(__dirname, "src", "node", "email", "template", "style", "webpack-entry.scss")
    ],
    output: {
        path: path.join(__dirname, outputDir),
        filename: "email-bundle.js",
    },
    devtool: "source-map",
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
    ],
    resolve: {
        extensions: [".scss", ".css", ".js", ".sass"],
        modules: ["scss", "node_modules"],
    },
};
