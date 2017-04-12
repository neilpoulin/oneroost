var gulp = require("gulp")
var gutil = require("gulp-util")
var {paths} = require("./../../build-paths")
var del = require("del")
var plumber = require("gulp-plumber")
var babel = require("gulp-babel")
var nodemon = require("gulp-nodemon")
var webpack = require("webpack")
var util = require("./util")
var getWebpackConfig = util.getWebpackConfig
var devEnvProps = {
    AWS_PROFILE: "oneroost",
    GA_TRACKING_CODE: "UA-87950724-3",
    STRIPE_PUBLISH_KEY: process.env.STRIPE_PUBLISH_KEY_TEST,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY_TEST,
    NODE_ENV: "development"
}

var prodEnvProps = {
    AWS_PROFILE: "oneroost",
    GA_TRACKING_CODE: "UA-87950724-3",
    STRIPE_PUBLISH_KEY: process.env.STRIPE_PUBLISH_KEY_TEST,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY_TEST,
    NODE_ENV: "production"
}

const transpileNode = () => {
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
    // move the templates
    gulp.src(paths.src.nodeview)
        .pipe(gulp.dest(paths.build.node));

    return gulp.src(paths.src.nodetemplates)
        .pipe(gulp.dest(paths.build.node));
}

const buildEmails = (done) => {
    let config = getWebpackConfig("emails")
    webpack(config).run((err, stats) => {
        if (err){
            var error = new gutil.PluginError("bundle", err);
            gutil.log(gutil.colors.red(error));
            if (done) {
                done();
            }
        }
        else{
            gutil.log("[email:styles - webpack]", stats.toString({
                colors: true,
                version: true,
                timings: true,
                errorDetails: true,
                hash: true,
                assets: true,
                chunks: false
            }));
            Object.keys(stats.compilation.assets).forEach(function(key) {
                gutil.log("Webpack Emails out: output ", gutil.colors.green(key));
            });

            if (done) {
                done();
            }
        }
    });
}

const startServer = (props) => {
    gutil.log("starting the server");
    nodemon({
        script: "main.js",
        watch: ["cloud"],
        ext: "js html ejs json",
        ignore: ["email/template/*"],
        delay: "200",
        env: props || devEnvProps
    })
        .on("restart", function () {
            console.log("nodemon restarted the node server!")
        })
}

const copyBuildToCloud = () => {
    gutil.log("Coping all build files to the cloud directory");
    return gulp.src(paths.build.node + "/**/*")
        .pipe(gulp.dest(paths.dest.cloud));
}

const copyEmailTemplatesToCloud = () => {
    gutil.log("Coping Email Template files to the cloud directory");
    return gulp.src(paths.build.node + "/email/template/**/*")
        .pipe(gulp.dest(paths.dest.cloud + "/email/template"));
}

gulp.task("clean:node", function(done){
    return del([paths.build.node, paths.dest.cloud]);
});

gulp.task("email:styles:clean", ["clean:node"], function(done){
    buildEmails(done)
});

gulp.task("transpile:node:clean", ["clean:node"], function(){
    return transpileNode()
});

gulp.task("email:styles", function(done){
    buildEmails(done)
})

gulp.task("email:styles:watch", ["email:styles"], function(done){
    return copyEmailTemplatesToCloud()
})

gulp.task("transpile:node:watch", ["transpile:node"], function(done){
    return copyBuildToCloud()
})

gulp.task("emails:watch", ["transpile:node", "email:styles"], function(done){
    return copyEmailTemplatesToCloud()
})

gulp.task("transpile:node", function(){
    return transpileNode()
})

gulp.task("copy:node:build", function(){
    return copyBuildToCloud();
})

gulp.task("copy:node:build:sync", ["clean:node", "build:node"], function(){
    gutil.log("Starting copyBuildToCloud")
    return copyBuildToCloud();
})

gulp.task("build:node", ["clean:node", "transpile:node:clean", "email:styles:clean"], function(done){
    gutil.log("all build steps finished");
    done();
})

gulp.task("node", ["build:node", "copy:node:build:sync"], function(){
    gutil.log("built and copied all files = require( scratch to the cloud directory");
})

gulp.task("start", ["clean:node", "node", "watch:node" ], function(){
    // gulp.src("").pipe(shell(["mongod --dbpath=data/db"]));
    gutil.log("Starting node server...")
    startServer();
    gutil.log("Node server started.")
})

gulp.task("watch:node", function(){
    gulp.watch(paths.src.styles, ["email:styles:watch"]);
    gulp.watch(paths.src.node, ["transpile:node:watch"]);
    gulp.watch(paths.src.nodeview, ["transpile:node:watch"]);
    gulp.watch(paths.src.nodetemplates, ["emails:watch"]);
})

gulp.task("start:prod", ["clean:node", "node", "watch:node"], function(){
    startServer(prodEnvProps)
})

gulp.task("start:no-build", ["set-prod-node-env"], function(){
    startServer(prodEnvProps)
})
