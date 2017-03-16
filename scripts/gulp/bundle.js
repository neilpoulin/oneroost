import gulp from "gulp"
import webpack from "webpack"
import gutil from "gulp-util"

import {getWebpackConfig} from "./util"

gulp.task("csstest", function(done){
    let config = getWebpackConfig("css")
    webpack(config).run((err, stats) => {
        if (err) {
            var error = new gutil.PluginError("bundle", err);
            gutil.log( gutil.colors.red(error));
            if (done) {
                done();
            }
        } else {
            gutil.log("[webpack:build]", stats.toString({
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
});
