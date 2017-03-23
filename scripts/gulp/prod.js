// Prod tasks - bundle and serve bundles
import gulp from "gulp"
import del from "del"
import gutil from "gulp-util"
import {paths} from "./../../build-paths";
import cleanCSS from "gulp-clean-css"
import webpack from "webpack"
import webpackConfig from "./../../webpack.prod.config.babel.js"
// import {exec} from "child_process"
import {runCommand} from "./util"
// import {baseDir} from "./util"


gulp.task("start:prod", ["set-prod-node-env"], function(){
    return runCommand("npm start");
});

gulp.task("clean:css", function(){
    return del(["./public/css/**.css"]);
});

gulp.task("clean:js", function(){
    return del(["./public/bundle", paths.build.frontendjs]);
});

gulp.task("clean:zip", function(){
    return del(paths.build.archive)
})

gulp.task("clean", ["clean:js", "clean:css", "clean:npm-log", "clean:zip"]);

gulp.task("bundle:clean", ["clean:js", "bundle", "version:bundle-clean"])

function getWebpackConfig(){
    let plugins = [];
    if (process.env.NODE_ENV === "production"){
        gutil.log(gutil.colors.green("**************** Bundling for production ******************"));
        plugins = plugins.concat([
            new webpack.DefinePlugin({
                "process.env": {
                    NODE_ENV: JSON.stringify("production")
                }
            }),
            new webpack.optimize.UglifyJsPlugin({
                sourceMap: true
            })
        ]);
    }
    else{
        gutil.log(gutil.colors.green("**************** Bundling for dev ******************"));
        plugins = plugins.concat([
            new webpack.HotModuleReplacementPlugin(),
        ])
    }
    webpackConfig.devtool = "source-map";
    webpackConfig.plugins = webpackConfig.plugins.concat(plugins);
    return webpackConfig;
}

gulp.task("bundle", ["version:bundle"], function(done){
    let webpackConfig = getWebpackConfig()
    webpack(webpackConfig).run((err, stats) => {
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
    }
);
})


gulp.task("css", ["sass"], function(){
    gulp.src(paths.build.cssbundle + "/" + paths.dest.styleName)
    .pipe(gulp.dest(paths.dest.css));
});

gulp.task("css:compress", ["sass"], function(){
    gulp.src(paths.build.cssbundle + "/" + paths.dest.styleName)
    .pipe(cleanCSS())
    .pipe(gulp.dest(paths.dest.css));
});

gulp.task("bundle:prod", ["set-prod-node-env", "bundle"]);

gulp.task("set-prod-node-env", function() {
    return process.env.NODE_ENV = "production";
});

gulp.task("compress", ["css:compress"]);
gulp.task("build:frontend", ["compress","bundle", "sass", "fonts", "lint"]);
gulp.task("build:all", ["compress","bundle:prod", "sass", "fonts", "build:cloud", "set-prod-node-env"]);


gulp.task("mongo-start", function() {
    var command = "mongod --dbpath db/data";
    runCommand(command);
});

gulp.task("mongo-stop", function() {
    var command = "mongo admin --eval 'db.shutdownServer();'"
    runCommand(command);
});
