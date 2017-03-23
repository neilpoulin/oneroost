// Prod tasks - bundle and serve bundles
import gulp from "gulp"
import gutil from "gulp-util"
import webpack from "webpack"
import {getWebpackConfig} from "./util"

gulp.task("bundle", ["version:bundle"], function(done){
    let webpackConfig = getWebpackConfig("prod")
    webpack(webpackConfig).run((err, stats) => {
        if (err) {
            var error = new gutil.PluginError("bundle", err);
            gutil.log( gutil.colors.red(error));
            if (done) {
                done();
            }
        } else {
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
    }
);
})


gulp.task("bundle:prod", ["set-prod-node-env", "bundle"]);

gulp.task("set-prod-node-env", function() {
    return process.env.NODE_ENV = "production";
});
