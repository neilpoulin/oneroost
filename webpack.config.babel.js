import {paths} from "./build-paths"
import webpack from "webpack"

module.exports = {
    entry: paths.src.jsEntry,
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
            Tether: "tether"
        })
    ],
    resolve: {
        extensions: [".js", ".jsx", ".json"],
        modules: ["jsx", "jsx/modules", "node_modules"],
    }
};
