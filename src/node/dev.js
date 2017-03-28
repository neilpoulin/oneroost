import express from "express"

module.exports.intitialize = (app) => {
    console.log("***** DEVELOPMENT ENV from dev.js **** ")
    console.log("Using Hot Module Reloader")
    var webpack = require("webpack");
    var webpackConfig = require("./../webpack.dev.config.babel.js");
    webpackConfig.watch = true
    webpackConfig.watchOptions = {aggregateTimeout: 200}

    var publicPath = webpackConfig.output.publicPath;
    console.log("public Path = ", publicPath)
    var compiler = webpack(webpackConfig);
    app.use(require("webpack-dev-middleware")(compiler, {
        noInfo: false,
        publicPath: publicPath,
        stats: {colors: true}
    }));

    app.use(require("webpack-hot-middleware")(compiler, {
        log: console.log,
        tes: 1
    }));
    // app.use("/static/css", express.static(__dirname + "./../public/css"));
    app.use("/static/images", express.static(__dirname + "./../public/images"));
}
