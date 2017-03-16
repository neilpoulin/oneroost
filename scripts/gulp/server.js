import gulp from "gulp"
import gutil from "gulp-util"
import {paths} from "./../../build-paths";
import del from "del"
import plumber from "gulp-plumber"
import babel from "gulp-babel"

gulp.task("build:node", ["clean:node", "transpile:node", "sass:node", "fonts:node", "version:node"]);
gulp.task("build:node-noclean", ["transpile:node", "sass:node", "fonts:node"]);
gulp.task("build:cloud-dev", ["build:node-noclean", "move:cloud", "version:node"]);
gulp.task("build:cloud", ["build:node", "sass:node", "fonts:node", "version:node", "move:cloud"]);

gulp.task("clean:cloud-style", function(){
    return del([paths.build.cloudStyles + "/**.*css"]);
});

gulp.task("clean:node", function(){
    return del([paths.build.node]);
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
