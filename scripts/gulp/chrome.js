// Prod tasks - bundle and serve bundles
var gulp = require("gulp")
var {paths} = require("./../../build-paths")
var {bundle} = require("./prod")

gulp.task("chrome", [], function(done){
    bundle(done, false, "chrome")
})

gulp.task("chrome:watch", ["chrome"], function(){
    gulp.watch([paths.src.chromeEntry, ...paths.src.frontend], ["chrome"]);
})
