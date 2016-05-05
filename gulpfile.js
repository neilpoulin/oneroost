var gulp = require("gulp");
var babel = require("gulp-babel");
var sass = require("gulp-sass");
var concat = require("gulp-concat");
var del = require("del");
var shell = require("gulp-shell");
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
        scripts: ["./src/**/*.jsx","./src/**/*.js"],
        cloud: ["./cloud/**/*.js"],
        gulpfile: ["./gulpfile.js"],
        styles: ["./src/scss/**/*.scss"],
        styleEntry: "./src/scss/index.scss",
        all: ["./src/**/*.js", "./src/**/*.jsx", "./cloud/**/*.js", "./gulpfile.js"],
        fonts: [bootstrapPaths.fonts, fontAwesomePaths.fonts]
    },
    build: {
        root: "./build",
        js: "./build/js",
        sourceFile: "./build/js/jsx/index.js",
        sourceMaps: ".build/**/*.js.map"
    },
    dest: {
        root: "./public",
        css: "./public/css",
        js: "./public/bundle",
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

    gulp.task("sass", ["clean:css"], function () {
        var scssStream = gulp.src(paths.src.styleEntry)
        .pipe(sourcemaps.init())
        .pipe(sass(sassOpts).on("error", sass.logError))
        .pipe(sourcemaps.write("./maps"))
        .pipe(concat(paths.dest.styleName));

        var lessStream = gulp.src(reactModalBootstrap.stylesheets)
        .pipe(less())
        .pipe(concat("less-files.less"));

        var mergedStream = merge(scssStream, lessStream)
        .pipe(concat("styles.css"))
        .pipe(gulp.dest(paths.dest.css));

        return mergedStream;
    });

    gulp.task("clean:css", function(){
        return del(["./public/css"]);
    });

    gulp.task("clean:js", function(){
        return del(["./public/bundle", paths.build.root]);
    });

    gulp.task("clean", ["clean:js", "clean:css"], function () {
        return del(["./npm-debug.log"]);
    });

    gulp.task("lint", function () {
        return gulp.src(paths.src.all)
        .pipe(eslint())
        .pipe(eslint.format());
    });

    gulp.task("transpile", ["clean:js", "lint"], function () {
        return gulp.src(paths.src.scripts)
        .pipe(plumber())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(babel())
        .on("error", function (err) {
            gutil.log(gutil.colors.red("[Task \"transpile\"][Babel Error]"));
            gutil.log(gutil.colors.red(err.message));
        })
        .pipe(sourcemaps.write())
        .pipe(plumber.stop())
        .pipe(gulp.dest(paths.build.js));
    });

    gulp.task("bundle", ["clean:js", "transpile"], function () {
        var b = browserify({
            entries: paths.build.sourceFile,
            debug: true
        });

        return plumber()
        .pipe(b.bundle()
        .on("error", function (err) {
            gutil.log(gutil.colors.red("[Task \"bundle\"][Browserify.bundle() Error]"));
            gutil.log(gutil.colors.red(err.message));
        }))
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
        .pipe(gulp.dest(paths.dest.js));
    });

    gulp.task("build", ["bundle", "sass", "fonts"]);

    gulp.task("watch", ["build"], function () {
        gulp.watch(paths.src.styles, ["sass", "fonts"]);
        gulp.watch(paths.src.scripts, ["bundle"]);
        gulp.watch(paths.src.cloud, ["lint"]);
    });

    gulp.task("clean:npm-log", ["clean"], function () {
        return file("npm-debug.log", "", {src: true}).pipe(gulp.dest("./"));
    });

    gulp.task("inspect", function () {
        gulp.src([]).pipe(nodeInspector({  // You'll need to tweak these settings per your setup
            debugPort: 5858,
            webHost: "localhost",
            webPort: "8085",
            preload: false
        }));
    });

    gulp.task("start", ["clean", "watch"], function(){
        nodemon({
            script: "main.js",
            watch: ["public", "cloud"]
        })
        .on("restart", function () {
            console.log("nodemon restarted the node server!")
        })
    });

    gulp.task("debug", ["clean", "watch", "inspect"], function(){
        nodemon({
            script: "main.js",
            watch: ["public", "cloud"],
            nodeArgs: ["--debug"]
        })
        .on("restart", function () {
            console.log("nodemon restarted the node server!")
        })
    });

    gulp.task("eb-deploy", ["clean:npm-log", "build"], shell.task("eb deploy"));
    gulp.task("deploy-aws", ["clean", "build", "eb-deploy"]);
