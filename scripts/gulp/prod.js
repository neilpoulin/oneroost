// Prod tasks - bundle and serve bundles
import gulp from "gulp"
import gutil from "gulp-util"
import webpack from "webpack"
import del from "del"
import {paths} from "./../../build-paths"
import {getWebpackConfig} from "./util"

const bundle = (done, withStats=false) => {
    let webpackConfig = getWebpackConfig("prod")
    webpack(webpackConfig).run((err, stats) => {
        if (err) {
            var error = new gutil.PluginError("bundle", err);
            gutil.log(gutil.colors.red(error));
            if (done) {
                done();
            }
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

gulp.task("bundle", ["set-prod-node-env", "version:bundle"], function(done){
    bundle(done, false)
})

gulp.task("bundle:stats", ["set-prod-node-env", "version:bundle"], function(done){
    bundle(done, true)
})

gulp.task("clean", function(done){
    return del([paths.build.node, paths.build.root, paths.dest.cloud, paths.dest.bundle]);
});

gulp.task("set-prod-node-env", function() {
    return process.env.NODE_ENV = "production";
});
