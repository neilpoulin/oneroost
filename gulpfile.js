'use strict'
var gulp = require('gulp');
var babel = require("gulp-babel");
var browserify = require("gulp-browserify");
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var browserify = require("gulp-browserify");
var del = require("del");
var shell = require("gulp-shell");

var paths = {
    scripts: ['./src/jsx/**/*.jsx'],
    styles: ['./src/scss/**/*.scss']
}

var outdir = {
    scripts: "./public/out/js",
    styles: "./public/out/css",
    root: "./public/out"
}

gulp.task('sass', function(){
    return gulp.src(paths.styles)
    .pipe(sass().on('error', sass.logError ) )
    // .pipe(concat('style.css'))
    .pipe(gulp.dest(outdir.styles));
});

gulp.task("transpile", function(){
    return gulp.src(paths.scripts)
    .pipe( babel() )
    .pipe( gulp.dest( "./build/js/" ) )
});

gulp.task('scripts', ['transpile'], function(){
    return gulp.src("./build/js/**/*.js")
    .pipe(browserify())
    .pipe( gulp.dest(outdir.scripts) );
});

gulp.task('clean', function(){
    return del([outdir.root, 'build', 'public/bundle']);
});

gulp.task('transpile:2', ['clean'], function(){
    return gulp.src('./src/jsx/**/*.js')
    .pipe( babel() )
    .pipe( gulp.dest( "./build/js/"));
});

gulp.task('bundle', ['clean', 'transpile:2'], function(){
    return gulp.src('./build/js/index.js')
    .pipe(browserify())
    .pipe(concat('bundle.js'))
    .pipe( gulp.dest('./public/bundle') );
});

gulp.task('build', ['clean', 'scripts', 'sass']);

gulp.task('parse-develop', shell.task('parse develop dev') );

gulp.task('watch', ['build'], function(){
    gulp.watch(paths.styles, ['sass']);
    gulp.watch(paths.scripts, ['scripts']);
});
gulp.task('develop', ['watch'], function(){
    gulp.run('parse-develop');
});
