var gulp = require("gulp")
var util = require("./util")
var runCommand = util.runCommand

gulp.task("update-config", ["mongo-start"], function(){
    var command = "mongo localhost:27017/oneroost-db db/scripts/update_configs.js";
    runCommand(command);
})

gulp.task("clean:db", ["mongo-start"], function(){
    var command = "mongo localhost:27017/oneroost-db db/scripts/clean.js";
    runCommand(command, true);
})

gulp.task("mongo-start", function() {
    var command = "mongod --dbpath db/data";
    runCommand(command);
});

gulp.task("mongo-stop", function() {
    var command = "mongo admin --eval 'db.shutdownServer();'"
    runCommand(command);
});
