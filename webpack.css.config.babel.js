const webpack = require("webpack")
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const extractCss = new ExtractTextPlugin("style-bundle.css");
const path = require("path")

import {paths,
    bootstrapPaths,
    fontAwesomePaths,
    GoogleMaterialColors,
    reactModalBootstrap,
    // infiniteCalendar
} from "./build-paths";
const outputDir = "dist";
const indexFile = path.join("src", "scss", "index_test.scss")


var sassOpts = {
    outputStyle: "nested",
    precison: 3,
    errLogToConsole: true,
    includePaths: [bootstrapPaths.stylesheets,
        fontAwesomePaths.stylesheets,
        GoogleMaterialColors.stylesheets,
        reactModalBootstrap.stylesheets,
        "./src/scss/**/*.scss"
    ]
};


process.traceDeprecation = true

module.exports = {
    entry:{
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
                                // includePaths: sassOpts.includePaths
                            }
                        },
                        {
                            loader: "sass-resources-loader",
                            options: {
                                resources: "./src/scss/sass-resources.scss",
                            }
                        }
                    ]
                })
            }],
        },
        plugins: [
            extractCss,
            // new webpack.ProvidePlugin({
            //     "window.Tether": "tether"
            // }),
        ],
        resolve: {
            extensions: [".scss", ".css"],
            modules: ["scss", "node_modules"],
        },
    };
