import gulp from "gulp"
import gutil from "gulp-util"
import git from "gulp-git"
import bump from "gulp-bump"
import filter from "gulp-filter"
import tagVersion from "gulp-tag-version"

export const getHashFromAwsPipeline = () => {
    let pipeline = require("./../../pipeline.json");
    try{
        return pipeline.stageStates[0]
            .actionStates[0]
            .currentRevision.revisionId
    }
    catch (e){
        gutil.log(gutil.colors.red(e))
        return null;
    }
}

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

gulp.task("patch", function() {
    return inc("patch");
})

gulp.task("feature", function() {
    return inc("minor");
})

gulp.task("release", function() {
    return inc("major");
})
