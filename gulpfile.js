'use strict'
var gulp = require('gulp');
var babel = require("gulp-babel");
var browserify = require("gulp-browserify");
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var del = require("del");
var shell = require("gulp-shell");
var plumber = require('gulp-plumber');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');

var bootstrapRoot = './node_modules/bootstrap-sass/';
var bootstrapPaths = {
    fonts: bootstrapRoot + 'assets/fonts/**/*',
    stylesheets: bootstrapRoot + 'assets/stylesheets'
}

var fontAwesomeRoot = './node_modules/font-awesome/';
var fontAwesomePaths = {
    fonts: fontAwesomeRoot + 'fonts/**/*',
    stylesheets: fontAwesomeRoot + 'scss'
}

var paths = {
    src: {
        root: './src',
        scripts: ['./src/**/*.jsx',
            './src/**/*.js',
            './node_modules/bootstrap/dist/js/bootstrap.min.js'],
        styles: ['./src/scss/index.scss'],
        fonts: [bootstrapPaths.fonts, fontAwesomePaths.fonts]
    },
    build: {
        root: './build',
        js: './build/js',
        sourceFile: './build/js/jsx/index.js',
        sourceMaps: '.build/**/*.js.map'
    },
    dest: {
        root: './public',
        css: './public/css',
        js: './public/bundle',
        fonts: './public/css/fonts',
        styleName: 'styles.css',
        scriptName: 'bundle.js'
    }
};

var sassOpts = {
    outputStyle: 'nested',
    precison: 3,
    errLogToConsole: true,
    includePaths: [bootstrapPaths.stylesheets, fontAwesomePaths.stylesheets, './src/scss/**/*.scss']
};

gulp.task('fonts', function(){
    return gulp.src( paths.src.fonts )
    .pipe( gulp.dest( paths.dest.fonts ) );
});

gulp.task('sass', ['clean', 'fonts'], function(){
    return gulp.src( paths.src.styles )
    .pipe(sourcemaps.init())
    .pipe( sass( sassOpts ).on( 'error', sass.logError ) )
    .pipe( concat( paths.dest.styleName ) )
    .pipe( sourcemaps.write('./maps') )
    .pipe( gulp.dest( paths.dest.css ) );
});

gulp.task('clean', function(){
    return del( [paths.build.root] );
});

gulp.task('clean:all', ['clean'], function(){
    return del(['./public/bundle', './public/css']);
});

gulp.task('transpile', ['clean'], function(){
    return gulp.src( paths.src.scripts )
    .pipe( plumber() )
    .pipe( sourcemaps.init({ loadMaps: true }) )
    .pipe( babel() )
    .on('error', function(err){
        gutil.log( gutil.colors.red('[Task "transpile"][Babel Error]') );
        gutil.log( gutil.colors.red(err.message) );
    })
    .pipe( sourcemaps.write() )
    .pipe( plumber.stop() )
    .pipe( gulp.dest( paths.build.js ));
});

gulp.task('bundle', ['clean', 'transpile' ], function(){
    var b = browserify({
      entries: paths.build.sourceFile,
      debug: true
    });

    return b.bundle()
    .pipe( plumber() )
    .pipe( source(paths.build.sourceFile) )
    .pipe( buffer() )
    .pipe( sourcemaps.init({ loadMaps: true }) )
    // .pipe( browserify({debug: true}) )
    .on('error', function(err){
        gutil.log( gutil.colors.red('[Task "bundle"][Browserify Error]') );
        gutil.log( gutil.colors.red(err.message) );
    })
    .pipe( plumber.stop() )
    .pipe( concat( paths.dest.scriptName ) )
    .pipe( sourcemaps.write('./maps') )
    .pipe( gulp.dest(paths.dest.js) );
});

gulp.task('build', ['clean', 'bundle', 'sass']);

gulp.task('parse-develop', shell.task('parse develop dev') );

gulp.task('watch', ['clean', 'build'], function(){
    gulp.watch( paths.src.styles, ['sass'] );
    gulp.watch( paths.src.scripts, ['bundle'] );
    gulp.watch( paths.src.fonts, ['fonts'] );
});
gulp.task('develop', ['watch', 'parse-develop']);
