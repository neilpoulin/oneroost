var gulp = require("gulp")
var git = require("gulp-git")
var getHashFromAwsPipeline = require("./git").getHashFromAwsPipeline
var string_src = require("./util").string_src
var paths = require("./../../build-paths").paths

gulp.task("version", ["version:src", "version:bundle", "version:node"])

gulp.task("version:src", function () {
    var pkg = require("./../../package.json")
    let version = {}
    git.revParse({args: "HEAD"}, function (err, hash) {
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

gulp.task("version:bundle", function(){
    var pkg = require("./../../package.json")
    let version = {}
    git.revParse({args: "HEAD"}, function (err, hash) {
        version.hash = hash
        if (!hash){
            version.hash = getHashFromAwsPipeline()
        }
        version.version = pkg.version
        let versionJSON = JSON.stringify(version)
        return string_src("version.js", "var oneroostVersion=" + versionJSON)
            .pipe(gulp.dest(paths.dest.frontendjs))
    });
})

gulp.task("version:node", function(){
    var pkg = require("./../../package.json")
    let version = {}
    git.revParse({args: "HEAD"}, function (err, hash) {
        version.hash = hash
        if (!hash){
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
