import gulp from "gulp"
import gutil from "gulp-util"
// import git from "gulp-git"
// import sass from "gulp-sass"
// import concat from "gulp-concat"
// import less from "gulp-less"
// import merge from "merge-stream"
// import {paths, bootstrapPaths, fontAwesomePaths, GoogleMaterialColors, reactModalBootstrap, infiniteCalendar} from "./../../build-paths";
// start dev server with hot reloading
import {baseDir} from "./util"


gulp.task("dev-test", function(){
    gutil.log("dev Test");
    gutil.log("base dir = ", baseDir);
});
//
// var sassOpts = {
//     outputStyle: "nested",
//     precison: 3,
//     errLogToConsole: true,
//     includePaths: [bootstrapPaths.stylesheets,
//         fontAwesomePaths.stylesheets,
//         GoogleMaterialColors.stylesheets,
//         reactModalBootstrap.stylesheets,
//         "./src/scss/**/*.scss"
//     ]
// };
//
// gulp.task("sass", ["clean:css"], function () {
//     var scssStream = gulp.src(paths.src.styleEntry)
//     .pipe(sass(sassOpts).on("error", sass.logError))
//     .pipe(concat(paths.dest.styleName));
//     var lessStream = gulp.src(reactModalBootstrap.stylesheets)
//     .pipe(less())
//     .pipe(concat("less-files.less"));
//     var cssStream = gulp.src(infiniteCalendar.stylesheets)
//     .pipe(concat("css-files.css"));
//
//     var mergedStream = merge(scssStream, lessStream, cssStream)
//     .pipe(concat("styles.css"))
//     .pipe(gulp.dest(paths.build.cssbundle));
//
//     return mergedStream;
// });

// gulp.task("update-config", ["mongo-start"], function(){
//     var command = "mongo localhost:27017/oneroost-db db/scripts/update_configs.js";
//     runCommand(command);
// })
