// Prod tasks - bundle and serve bundles
var gulp = require("gulp")
var gutil = require("gulp-util")
var webpack = require("webpack")
var del = require("del")
var {paths} = require("./../../build-paths")
var {getWebpackConfig} = require("./util")

const bundle = (done, withStats=false) => {
    let webpackConfig = getWebpackConfig("prod", false)
    console.log(JSON.stringify(webpackConfig, null, 2))
    webpack(webpackConfig).run((err, stats) => {
        if (err) {
            var error = new gutil.PluginError("bundle", err);
            gutil.log(gutil.colors.red(error));
            throw new gutil.PluginError({
                plugin: "bundle",
                message: "Failed to process webpack config successfully."
            });
        }
        else {
            gutil.log("[webpack:build-prod]", stats.toString({
                colors: true,
                version: true,
                timings: true,
                errorDetails: true,
                hash: true,
                assets: true,
                chunks: false
            }));
            Object.keys(stats.compilation.assets).forEach(function(key) {
                gutil.log("Webpack: output ", gutil.colors.green(key));
            });
            if (done) {
                done();
            }
        }
    })
}

gulp.task("bundle", [/*"set-prod-node-env",*/ "version:bundle"], function(done){
    bundle(done, false)
})

gulp.task("install", ["bundle", "node"]);

gulp.task("bundle:stats", ["set-prod-node-env", "version:bundle"], function(done){
    bundle(done, true)
})

gulp.task("clean", function(done){
    return del([paths.build.node, paths.build.root, paths.dest.cloud, paths.dest.bundle]);
});

gulp.task("set-prod-node-env", function() {
    return process.env.NODE_ENV = "production";
});
