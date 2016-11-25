var gulp = require("gulp");
var babel = require("gulp-babel");
var sass = require("gulp-sass");
var concat = require("gulp-concat");
var del = require("del");
var shell = require("gulp-shell");
var exec = require("child_process").exec;
var plumber = require("gulp-plumber");
var gutil = require("gulp-util");
var sourcemaps = require("gulp-sourcemaps");
var source = require("vinyl-source-stream");
var buffer = require("vinyl-buffer");
var browserify = require("browserify");
var less = require("gulp-less");
var merge = require("merge-stream");
var file = require("gulp-file");
var eslint = require("gulp-eslint");
var nodemon = require("gulp-nodemon");
var nodeInspector = require("gulp-node-inspector");
var minify = require("gulp-minify");
var cleanCSS = require("gulp-clean-css");

var devEnvProps = {
    AWS_PROFILE: "oneroost",
    GA_TRACKING_CODE: "UA-87950724-3"
}

var bootstrapRoot = "./node_modules/bootstrap-sass/";
var bootstrapPaths = {
    fonts: bootstrapRoot + "assets/fonts/**/*",
    stylesheets: bootstrapRoot + "assets/stylesheets"
};

var fontAwesomeRoot = "./node_modules/font-awesome/";
var fontAwesomePaths = {
    fonts: fontAwesomeRoot + "fonts/**/*",
    stylesheets: fontAwesomeRoot + "scss"
};

var materialColorsRoot = "./node_modules/sass-material-colors/";
var GoogleMaterialColors = {
    stylesheets: materialColorsRoot + "sass"
};

var reactModalBootstrap = {
    stylesheets: "./node_modules/react-bootstrap-modal/lib/styles/rbm-patch.less"
};

var paths = {
    src: {
        root: "./src",
        frontend: ["./src/jsx/**/*.jsx","./src/jsx/**/*.js"],
        node: ["./src/node/**/*.js"],
        nodetemplates: ["./src/node/**/*.hbs", "./src/node/**/*.scss", "./src/node/**/*.json", "./src/node/**/*.ejs" ],
        gulpfile: ["./gulpfile.js"],
        styles: ["./src/scss/**/*.scss"],
        styleEntry: "./src/scss/index.scss",
        all: ["./src/**/*.js", "./src/**/*.jsx", "./cloud/**/*.js", "./gulpfile.js"],
        fonts: [bootstrapPaths.fonts, fontAwesomePaths.fonts, "./src/fonts/**/*"]
    },
    build: {
        root: "./build",
        frontendjs: "./build/frontendjs",
        node: "./build/node",
        nodeStyles: "./build/node/email/template/style/target",
        nodeFonts: "./build/node/email/template/style/target/fonts",
        jsbundle: "./build/dist/frontendjs",
        cssbundle: "./build/dist/css",
        sourceFile: "./build/frontendjs/index.js",
        sourceMaps: ".build/**/*.js.map"
    },
    dest: {
        root: "./public",
        css: "./public/css",
        frontendjs: "./public/bundle",
        cloud: "./cloud",
        fonts: "./public/css/fonts",
        styleName: "styles.css",
        scriptName: "bundle.js"
    }
};

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

        var mergedStream = merge(scssStream, lessStream)
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

    gulp.task("transpile", ["clean:js"], function () {
        return gulp.src(paths.src.frontend)
        .pipe(plumber({
            handleError: function (err) {
                console.log(err);
                this.emit("end");
            }
        }))
        // .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(babel())
        .on("error", function (err) {
            gutil.log(gutil.colors.red("[Task \"transpile\"][Babel Error]"));
            gutil.log(gutil.colors.red(err.message));
        })
        // .pipe(sourcemaps.write())
        .pipe(plumber.stop())
        .pipe(gulp.dest(paths.build.frontendjs));
    });

    gulp.task("bundle", ["transpile"], function () {
        var b = browserify({
            entries: paths.build.sourceFile,
            debug: true
        });

        return plumber({
            handleError: function (err) {
                console.log(err);
                this.emit("end");
            }
        })
        .pipe(b.bundle()
            .on("error", function (err) {
                gutil.log(gutil.colors.red("[Task \"bundle\"][Browserify.bundle() Error]"));
                gutil.log(gutil.colors.red(err.message));
            })
        )
        .pipe(source(paths.build.sourceFile))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        // .pipe( browserify({debug: true}) )
        .on("error", function (err) {
            gutil.log(gutil.colors.red("[Task \"bundle\"][Browserify Error]"));
            gutil.log(gutil.colors.red(err.message));
        })
        .pipe(concat(paths.dest.scriptName))
        // .pipe( sourcemaps.write("./maps") )
        .pipe(plumber.stop())
        .pipe(gulp.dest(paths.build.jsbundle));
    });

    gulp.task("ugly:css", ["sass"], function(){
        gulp.src(paths.build.cssbundle + "/" + paths.dest.styleName)
        .pipe(gulp.dest(paths.dest.css));
    });

    gulp.task("compress:css", ["sass"], function(){
        gulp.src(paths.build.cssbundle + "/" + paths.dest.styleName)
        .pipe(cleanCSS())
        .pipe(gulp.dest(paths.dest.css));
    });

    gulp.task("compress:js", ["bundle"], function(){
        gulp.src(paths.build.jsbundle + "/*.js")
        .pipe(minify({
            ext:{
                src:".js",
                min:".js"
            },
            exclude: ["tasks"],
            ignoreFiles: ["-min.js"],
            noSource: true
        }))
        .pipe(gulp.dest(paths.dest.frontendjs));
    });

    gulp.task("ugly:js", ["bundle"], function(){
        gulp.src(paths.build.jsbundle +"/*.js")
        .pipe(concat(paths.dest.scriptName))
        .pipe(gulp.dest(paths.dest.frontendjs));
    });

    gulp.task("build:node", ["clean:node", "transpile:node", "sass:node", "fonts:node"]);
    gulp.task("build:node-noclean", ["transpile:node", "sass:node", "fonts:node"]);
    gulp.task("build:cloud-dev", ["build:node-noclean", "move:cloud"]);
    gulp.task("build:cloud", ["build:node", "move:cloud"]);
    gulp.task("compress", ["compress:css", "compress:js"]);
    gulp.task("build:frontend", ["compress","bundle", "sass", "fonts", "lint"]);
    gulp.task("build:all", ["compress","bundle", "sass", "fonts", "lint", "build:cloud"]);

    gulp.task("build:dev", ["ugly:js","ugly:css", "build:cloud-dev"]);

    gulp.task("watch", ["build:dev"], function () {
        gulp.watch(paths.src.styles, ["ugly:css", "sass"]);
        gulp.watch(paths.src.frontend, ["ugly:js"]);
        gulp.watch(paths.src.node, ["build:cloud-dev"]);
    });


    gulp.task("watch:prod", ["build:all"], function () {
        gulp.watch(paths.src.styles, ["compress:css"]);
        gulp.watch(paths.src.frontend, ["compress:js"]);
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

    function runCommand(command) {
        exec(command, function (err, stdout, stderr) {
            console.log(stdout);
            console.log(stderr);
            if (err !== null) {
                console.log("exec error: " + err);
            }
        });
    }

    gulp.task("eb-deploy:stage", ["clean:npm-log", "build:all"], shell.task("eb deploy stage --timeout 25"));
    gulp.task("deploy", ["build:all", "eb-deploy:stage"]);

    gulp.task("update-config", ["mongo-start"], function(){
        var command = "mongo localhost:27017/oneroost-db db/scripts/update_configs.js";
        runCommand(command);
    })
