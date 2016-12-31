var gulp = require("gulp");
var babel = require("gulp-babel");
var sass = require("gulp-sass");
var concat = require("gulp-concat");
var del = require("del");
var shell = require("gulp-shell");
var exec = require("child_process").exec;
var plumber = require("gulp-plumber");
var gutil = require("gulp-util");
var less = require("gulp-less");
var merge = require("merge-stream");
var file = require("gulp-file");
var eslint = require("gulp-eslint");
var nodemon = require("gulp-nodemon");
var nodeInspector = require("gulp-node-inspector");
var cleanCSS = require("gulp-clean-css");
var webpack = require("webpack");
var webpackConfig = require("./webpack.config.babel.js")
import {paths, bootstrapPaths, fontAwesomePaths, GoogleMaterialColors, reactModalBootstrap, infiniteCalendar,} from "./build-paths";

var devEnvProps = {
    AWS_PROFILE: "oneroost",
    GA_TRACKING_CODE: "UA-87950724-3"
}

var sassOpts = {
    outputStyle: "nested",
    precison: 3,
    errLogToConsole: true,
    includePaths: [bootstrapPaths.stylesheets,
        fontAwesomePaths.stylesheets,
        GoogleMaterialColors.stylesheets,
        reactModalBootstrap.stylesheets,
        "./src/scss/**/*.scss"]
    };


    gulp.task("fonts", ["sass"], function () {
        return gulp.src(paths.src.fonts)
        .pipe(gulp.dest(paths.dest.fonts));
    });

    gulp.task("fonts:node", ["sass:node"], function () {
        return gulp.src(paths.src.fonts)
        .pipe(gulp.dest(paths.build.nodeFonts));
    });

    gulp.task("sass:node", ["clean:cloud-style", "clean:node"], function(){
        return gulp.src(paths.src.styles)
        .pipe(gulp.dest(paths.build.nodeStyles))
    });

    gulp.task("sass", ["clean:css"], function () {
        var scssStream = gulp.src(paths.src.styleEntry)
        .pipe(sass(sassOpts).on("error", sass.logError))
        .pipe(concat(paths.dest.styleName));
        var lessStream = gulp.src(reactModalBootstrap.stylesheets)
        .pipe(less())
        .pipe(concat("less-files.less"));
        var cssStream = gulp.src(infiniteCalendar.stylesheets)
        .pipe(concat("css-files.css"));

        var mergedStream = merge(scssStream, lessStream, cssStream)
        .pipe(concat("styles.css"))
        .pipe(gulp.dest(paths.build.cssbundle));

        return mergedStream;
    });

    gulp.task("clean:cloud-style", function(){
        return del([paths.build.cloudStyles + "/**.*css"]);
    });

    gulp.task("clean:css", function(){
        return del(["./public/css/**.css"]);
    });

    gulp.task("clean:node", function(){
        return del([paths.build.node]);
    });

    gulp.task("clean:js", function(){
        return del(["./public/bundle", paths.build.frontendjs]);
    });

    gulp.task("clean", ["clean:js", "clean:css", "clean:npm-log"]);

    gulp.task("lint", function () {
        return gulp.src(paths.src.all)
        .pipe(eslint())
        .pipe(eslint.format());
    });

    gulp.task("transpile:node", ["clean:node"], function(){
        gulp.src(paths.src.node)
        .pipe(plumber({
            handleErrors: function(error){
                console.error(error);
                this.emit("end");
            }
        }))
        .pipe(babel())
        .on("error", function (err) {
            gutil.log(gutil.colors.red("[Task \"transpile:node\"][Babel Error]"));
            gutil.log(gutil.colors.red(err.message));
        })
        .pipe(plumber.stop())
        .pipe(gulp.dest(paths.build.node));

        return gulp.src(paths.src.nodetemplates)
        .pipe(gulp.dest(paths.build.node));
    });

    gulp.task("move:cloud", ["clean:node", "transpile:node"], function(){
        gulp.src(paths.build.node + "/**/*")
        .pipe(gulp.dest(paths.dest.cloud));
    });

    gulp.task("bundle", function(done){
        let plugins = [];
        if (process.env.NODE_ENV === "production"){
            gutil.log(gutil.colors.green("**************** Bundling for production ******************"));
            plugins = plugins.concat([
                new webpack.DefinePlugin({
                    "process.env": {
                        NODE_ENV: JSON.stringify("production")
                    }
                }),
                new webpack.optimize.UglifyJsPlugin()
            ]);
        }
        else{
            gutil.log(gutil.colors.green("**************** Bundling for dev ******************"));
            webpackConfig.devtool = "source-map";
        }
        webpackConfig.plugins = webpackConfig.plugins.concat(plugins);

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

gulp.task("bundle:prod", ["bundle", "set-prod-node-env"]);

gulp.task("set-prod-node-env", function() {
    return process.env.NODE_ENV = "production";
});

gulp.task("build:node", ["clean:node", "transpile:node", "sass:node", "fonts:node"]);
gulp.task("build:node-noclean", ["transpile:node", "sass:node", "fonts:node"]);
gulp.task("build:cloud-dev", ["build:node-noclean", "move:cloud"]);
gulp.task("build:cloud", ["build:node", "move:cloud"]);
gulp.task("compress", ["css:compress"]);
gulp.task("build:frontend", ["compress","bundle", "sass", "fonts", "lint"]);
gulp.task("build:all", ["compress","bundle", "sass", "fonts", "build:cloud"]);

gulp.task("build:dev", ["bundle","css", "build:cloud-dev"]);

gulp.task("watch", ["build:dev"], function () {
    gulp.watch(paths.src.styles, ["css", "sass"]);
    gulp.watch(paths.src.frontend, ["bundle"]);
    gulp.watch(paths.src.node, ["build:cloud-dev"]);
    gulp.watch(paths.src.nodetemplates, ["build:cloud-dev"]);
});


gulp.task("watch:prod", ["build:all"], function () {
    gulp.watch(paths.src.styles, ["css:compress"]);
    gulp.watch(paths.src.frontend, ["bundle"]);
    gulp.watch(paths.src.node, ["build:cloud"]);
});

gulp.task("clean:npm-log", function () {
    del(["./npm-debug.log"]);
    return file("npm-debug.log", "", {src: true}).pipe(gulp.dest("./"));
});

gulp.task("inspect", function () {
    gulp.src([]).pipe(nodeInspector({  // You"ll need to tweak these settings per your setup
    debugPort: 5858,
    webHost: "localhost",
    webPort: "8085",
    preload: false
}));
});

gulp.task("start:prod", ["watch:prod"], function(){
    // gulp.src("").pipe(shell(["mongod --dbpath=data/db"]));
    nodemon({
        script: "main.js",
        watch: ["cloud", "cloud/email/**/*.hbs", "cloud/**/*.json"],
        env: devEnvProps
    })
    .on("restart", function () {
        console.log("nodemon restarted the node server!")
    })
});

gulp.task("start", ["mongo-start","clean", "update-config", "watch"], function(){
    // gulp.src("").pipe(shell(["mongod --dbpath=data/db"]));
    nodemon({
        script: "main.js",
        watch: ["cloud", "cloud/email/**/*.hbs", "cloud/**/*.json"],
        env: devEnvProps
    })
    .on("restart", function () {
        console.log("nodemon restarted the node server!")
    })
});

gulp.task("debug", ["mongo-start", "clean", "update-config", "watch", "inspect"], function(){
    // gulp.src("").pipe(shell(["mongod --dbpath=data/db"]));
    nodemon({
        script: "main.js",
        watch: ["cloud", "cloud/**/*.hbs", "cloud/**/*.json"],
        nodeArgs: ["--debug"],
        env: devEnvProps
    })
    .on("restart", function () {
        console.log("nodemon restarted the node server!")
    })
});

gulp.task("mongo-start", function() {
    var command = "mongod --dbpath db/data";
    runCommand(command);
});

gulp.task("mongo-stop", function() {
    var command = "mongo admin --eval 'db.shutdownServer();'"
    runCommand(command);
});

function runCommand(command, log=false) {
    exec(command, function (err, stdout, stderr) {
        if (log){
            gutil.log(gutil.colors.yellow(stdout))
        }

        gutil.log(stderr.toString({
            colors: true
        }));
        if (err !== null) {
            console.log("exec error: " + err);
        }
    });
}

gulp.task("eb-deploy:stage", ["clean:npm-log", "build:all", "set-prod-node-env"], shell.task("eb deploy stage --timeout 25"));
gulp.task("deploy", ["build:all", "eb-deploy:stage", "set-prod-node-env"]);

gulp.task("update-config", ["mongo-start"], function(){
    var command = "mongo localhost:27017/oneroost-db db/scripts/update_configs.js";
    runCommand(command);
})