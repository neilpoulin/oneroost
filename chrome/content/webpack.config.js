const webpack = require("webpack")
const path = require("path")
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const extractCss = new ExtractTextPlugin({
    filename: "content.css", allChunks: false
})

module.exports = {
    entry: [
        path.join(__dirname, "src", "scripts", "index.js"),
        path.join(__dirname, "src", "styles", "index.scss"),
    ],

    output: {
        filename: "content.js",
        path: path.join(__dirname, "../", "build"),
        publicPath: "/"
    },

    resolve: {
        extensions: [".js", ".jsx", ".scss", ".json"],
        modules: [ "components/app", "view", "atoms", "node_modules" ]
    },
    devtool: "source-map",
    module: {
        loaders: [
            {
                test: /\.(jsx|js)?$/,
                loader: "babel-loader",
                exclude: /(node_modules|lib)/,
                include: path.join(__dirname, "src"),
                query: {
                    presets: ["es2015", "react", "stage-0"]
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
                            options: {sourceMap: false}
                        },
                        {
                            loader: "sass-loader",
                            options: {sourceMap: false, }
                        },
                        {
                            loader: "sass-resources-loader",
                            options: {
                                resources: __dirname + "/src/styles/sass-resources.scss",
                                sourceMap: false,
                            }
                        }
                    ]
                })
            }
        ]
    },
    plugins: [
        extractCss,
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.DefinePlugin({"process.env": {NODE_ENV: JSON.stringify("production")}}),
        new OptimizeCssAssetsPlugin()
    ],
    context: __dirname,
};
