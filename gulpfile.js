'use strict'
var gulp = require('gulp');
var babel = require("gulp-babel");
var browserify = require("gulp-browserify");
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var browserify = require("gulp-browserify");
var del = require("del");
var shell = require("gulp-shell");
var plumber = require('gulp-plumber');
var gutil = require('gulp-util');

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
        scripts: ['./src/jsx/**/*.jsx'],
        styles: ['./src/scss/**/*.scss'],
        fonts: [bootstrapPaths.fonts, fontAwesomePaths.fonts]
    },
    build: {
        root: './build',
        js: '.build/js',
        sourceFile: '.build/js/index.js'
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
    includePaths: [bootstrapPaths.stylesheets, fontAwesomePaths.stylesheets]
};

gulp.task('fonts', function(){
    return gulp.src( paths.src.fonts )
    .pipe( gulp.dest( paths.dest.fonts ) );
});

gulp.task('sass', ['clean', 'fonts'], function(){
    return gulp.src( paths.src.styles )
    .pipe( sass( sassOpts ).on('error', sass.logError ) )
    .pipe( concat(paths.dest.styleName) )
    .pipe( gulp.dest( paths.dest.css ) );
});

gulp.task('clean', function(){
    return del( ['build'] );
});

gulp.task('transpile', ['clean'], function(){
    return gulp.src( paths.src.scripts )
    .pipe( plumber() )
    .pipe( babel() )
    .on('error', function(err){
        gutil.log( gutil.colors.red('[Transpile Error]') );
        gutil.log( gutil.colors.red(err.message) );
    })
    .pipe( plumber.stop() )
    .pipe( gulp.dest( paths.build.js ));
});

gulp.task('bundle', ['clean', 'transpile' ], function(){
    return gulp.src( paths.build.sourceFile )
    .pipe( plumber() )
    .pipe( browserify() )
    .on('error', function(err){
        gutil.log( gutil.colors.red('[Compilation Error]') );
        gutil.log( gutil.colors.red(err.message) );
    })
    .pipe( plumber.stop() )
    .pipe( concat( paths.dest.scriptName ) )
    .pipe( gulp.dest(paths.dest.js) );
});

gulp.task('build', ['clean', 'bundle', 'sass']);

gulp.task('parse-develop', shell.task('parse develop dev') );

gulp.task('watch', ['clean', 'build'], function(){
    gulp.watch( paths.src.styles, ['sass'] );
    gulp.watch( paths.src.scripts, ['bundle'] );
    gulp.watch( paths.src.fonts, ['fonts'] );
});
gulp.task('develop', ['watch'], function(){
    gulp.run( 'parse-develop' );
});
