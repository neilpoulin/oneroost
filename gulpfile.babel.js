import gulp from "gulp"
import babel from "gulp-babel"
import sass from "gulp-sass"
import concat from "gulp-concat"
import del from "del"
import shell from "gulp-shell"
import {exec} from "child_process"
import plumber from "gulp-plumber"
import gutil from "gulp-util"
import less from "gulp-less"
import merge from "merge-stream"
import file from "gulp-file"
import eslint from "gulp-eslint"
import nodemon from "gulp-nodemon"
import nodeInspector from "gulp-node-inspector"
import cleanCSS from "gulp-clean-css"
import webpack from "webpack"
import webpackConfig from "./webpack.config.babel.js"
import git from "gulp-git"
import bump from "gulp-bump"
import filter from "gulp-filter"
import tagVersion from "gulp-tag-version"
import browserSync from "browser-sync"
import webpackDevMiddleware from "webpack-dev-middleware"
import webpackHotMiddleware from "webpack-hot-middleware"

import {paths, bootstrapPaths, fontAwesomePaths, GoogleMaterialColors, reactModalBootstrap, infiniteCalendar} from "./build-paths";

var devEnvProps = {
    AWS_PROFILE: "oneroost",
    GA_TRACKING_CODE: "UA-87950724-3",
    STRIPE_PUBLISH_KEY: process.env.STRIPE_PUBLISH_KEY_TEST,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY_TEST,
}

var sassOpts = {
    outputStyle: "nested",
    precison: 3,
    errLogToConsole: true,
    includePaths: [bootstrapPaths.stylesheets,
        fontAwesomePaths.stylesheets,
        GoogleMaterialColors.stylesheets,
        reactModalBootstrap.stylesheets,
        "./src/scss/**/*.scss"
    ]
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

gulp.task("clean:zip", function(){
    return del(paths.build.archive)
})

gulp.task("clean", ["clean:js", "clean:css", "clean:npm-log", "clean:zip"]);

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

gulp.task("move:cloud", ["clean:node", "transpile:node", "sass:node", "fonts:node"], function(){
    gulp.src(paths.build.node + "/**/*")
    .pipe(gulp.dest(paths.dest.cloud));
});

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
    let webpack = getWebpackConfig()
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

gulp.task("build:node", ["clean:node", "transpile:node", "sass:node", "fonts:node", "version:node"]);
gulp.task("build:node-noclean", ["transpile:node", "sass:node", "fonts:node"]);
gulp.task("build:cloud-dev", ["build:node-noclean", "move:cloud", "version:node"]);
gulp.task("build:cloud", ["build:node", "sass:node", "fonts:node", "version:node", "move:cloud"]);
gulp.task("compress", ["css:compress"]);
gulp.task("build:frontend", ["compress","bundle", "sass", "fonts", "lint"]);
gulp.task("build:all", ["compress","bundle:prod", "sass", "fonts", "build:cloud", "set-prod-node-env"]);

gulp.task("build:dev", [
    // "bundle",
    "css",
    "build:cloud-dev",
    "version"
]);

gulp.task("watch", ["clean:js", "build:dev"], function () {
    gulp.watch(paths.src.styles, ["css", "sass"]);
    // gulp.watch(paths.src.frontend, ["bundle", "version:bundle"]);
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

gulp.task("start:prod", ["version", "watch:prod"], function(){
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

gulp.task("start", ["mongo-start","clean", "update-config", "watch", "move:cloud", "start:node"], function(){

});

gulp.task("start:node", function(){
    // gulp.src("").pipe(shell(["mongod --dbpath=data/db"]));
    nodemon({
        script: "main.js",
        watch: ["cloud", "cloud/email/**/*.hbs", "cloud/**/*.json"],
        env: devEnvProps
    })
    .on("restart", function () {
        console.log("nodemon restarted the node server!")
    })
})

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

function string_src(filename, string) {
    var src = require("stream").Readable({ objectMode: true })
    src._read = function () {
        this.push(new gutil.File({
            cwd: "",
            base: "",
            path: filename,
            contents: new Buffer(string)
        }))
        this.push(null)
    }
    return src
}


gulp.task("version", ["version:src", "version:bundle", "version:node"])

function getHashFromAwsPipeline(){
    let pipeline = require("./pipeline.json");
    try{
        return pipeline.stageStates[0].actionStates[0].currentRevision.revisionId
    } catch (e){
        gutil.log(gutil.colors.red(e))
        return null;
    }
}

gulp.task("version:src", function () {
    var pkg = require("./package.json")
    let version = {}
    git.revParse({args:"HEAD"}, function (err, hash) {
        // version.hash = hash
        // if ( !hash ){
        version.hash = getHashFromAwsPipeline()
        // }
        version.version = pkg.version
        let versionJSON = JSON.stringify(version)
        string_src("version.js", "var oneroostVersion=" + versionJSON)
        .pipe(gulp.dest(paths.dest.frontendjs))

        return string_src("version.json", versionJSON)
        .pipe(gulp.dest(paths.src_jsx))
    });
})

gulp.task("version:bundle", ["clean:js"], function(){
    var pkg = require("./package.json")
    let version = {}
    git.revParse({args:"HEAD"}, function (err, hash) {
        version.hash = hash
        if ( !hash ){
            version.hash = getHashFromAwsPipeline()
        }
        version.version = pkg.version
        let versionJSON = JSON.stringify(version)
        return string_src("version.js", "var oneroostVersion=" + versionJSON)
        .pipe(gulp.dest(paths.dest.frontendjs))
    });
})


gulp.task("version:node", function(){
    var pkg = require("./package.json")
    let version = {}
    git.revParse({args:"HEAD"}, function (err, hash) {
        version.hash = hash
        if ( !hash ){
            version.hash = getHashFromAwsPipeline()
        }
        version.version = pkg.version
        let versionJSON = JSON.stringify(version)
        string_src("version.js", "var oneroostVersion=" + versionJSON)
        .pipe(gulp.dest(paths.dest.frontendjs))

        return string_src("version.json", versionJSON)
        .pipe(gulp.dest(paths.src_node))
    });
})

function inc(importance) {
    // get all the files to bump version in
    return gulp.src(["./package.json"])
    // bump the version number in those files
    .pipe(bump({type: importance}))
    // save it back to filesystem
    .pipe(gulp.dest("./"))
    // commit the changed version number
    .pipe(git.commit("bump package version: " + importance))

    // read only one file to get the version number
    .pipe(filter("package.json"))
    // **tag it in the repository**
    .pipe(tagVersion());
}

gulp.task("patch", function() { return inc("patch"); })
gulp.task("feature", function() { return inc("minor"); })
gulp.task("release", function() { return inc("major"); })
