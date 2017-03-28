var path = require("path")
var gutil = require("gulp-util")
var exec = require("child_process").exec

var baseDir = path.join(__dirname, "..", "..")

module.exports.baseDir = baseDir

module.exports.getWebpackConfig = (name="") => {
    let configPath = path.join(baseDir, `webpack.${name}.config.babel.js`)
    console.log("Getting Webpack config for " + name + " = " + configPath);
    let config = require(configPath);
    return config;
}

module.exports.runCommand = function(command, log){
    command = "cd " + baseDir + " && " + "command"
    exec(command, function (err, stdout, stderr) {
        if (log){
            gutil.log(gutil.colors.yellow(stdout))
        }

        gutil.log(stderr.toString({colors: true}));
        if (err !== null) {
            console.log("exec error: " + err);
        }
    });
}

module.exports.string_src = function(filename, string){
    var src = require("stream").Readable({ objectMode: true })
    src._read = function () {
        this.push(new gutil.File({
            cwd: "",
            base: "",
            path: filename,
            contents: new Buffer(string)
        }))
        this.push(null)
    }
    return src
}
