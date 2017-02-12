import {paths} from "./build-paths"
import webpack from "webpack"
import "babel-polyfill"

module.exports = {
    entry: ["babel-polyfill","index.jsx"],
    context: __dirname + "/src/jsx",
    output: {
        path: __dirname + "/public/bundle",
        filename: paths.dest.scriptName
    },
    module: {
        rules: [
            {
                test: /.jsx?$/,
                loader: "babel-loader",
                exclude: /node_modules/,
                query: {
                    presets: ["es2015", "react"]
                }
            }
        ],
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            Tether: "tether",
        })
    ],
    resolve: {
        extensions: [".js", ".jsx", ".json"],
        modules: ["jsx", "modules", "ducks", "util", "admin", "deal", "form", "modules/dashboard", "navigation", "node_modules", "models", "actions", "reducers", "store", "middleware", "version"],
    }
};
