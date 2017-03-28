import {paths} from "./build-paths"
import webpack from "webpack"
import "babel-polyfill"
import path from "path"
process.traceDeprecation = true

module.exports = {
    entry: [
        "webpack/hot/dev-server",
        "webpack-hot-middleware/client",
        "babel-polyfill",
        path.join(__dirname, paths.src_jsx, "index.jsx")
    ],
    context: path.join(__dirname, "/src/jsx"),
    output: {
        path: path.join(__dirname, "/public/bundle"),
        filename: paths.dest.scriptName,
        publicPath: "public/bundle",
    },
    // module: {
    //     rules: [
    //         {
    //             test: /.jsx?$/,
    //             loaders: ["babel-loader"],
    //             exclude: /node_modules/,
    //             query: {
    //                 presets: ["es2015", "react"]
    //             }
    //         }
    //     ],
    // },

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
            }
        ],
        // loaders: [{
        //     test: /\.json$/,
        //     loader: "json-loader"
        // },
        // {
        //     test: /\.jsx?/,
        //     exclude: /(node_modules|bower_components|cloud|build)/,
        //     // include: [path.join(__dirname, paths.src_jsx)],
        //     loaders: ["react-hot-loader", "babel-loader?presets[]=react,presets[]=es2015", "webpack-module-hot-accept"],
        // }],
    },

    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            Tether: "tether",
        }),
    ],
    resolve: {
        extensions: [".js", ".jsx", ".json"],
        modules: ["jsx", "modules", "ducks", "util", "admin", "payment", "deal", "form", "modules/dashboard", "navigation", "node_modules", "models", "actions", "reducers", "store", "middleware", "version"],
    },
    devServer: {
        contentBase: __dirname + "/public/bundle",
        compress: true,
        port: 3000,
        hot: true,
    }
};
