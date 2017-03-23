import path from "path"
import gutil from "gulp-util"
import {exec} from "child_process"
export const baseDir = path.join(__dirname, "..", "..")

export const getWebpackConfig = (name="") => {
    let configPath = path.join(baseDir, `webpack.${name}.config.babel.js`)
    console.log("Getting Webpack config for " + name + " = " + configPath);
    let config = require(configPath);
    console.log(config)
    return config;
}


export const runCommand = (command, log=false) => {
    command = `cd ${baseDir} && ${command}`
    exec(command, function (err, stdout, stderr) {
        if (log){
            gutil.log(gutil.colors.yellow(stdout))
        }

        gutil.log(stderr.toString({
            colors: true
        }));
        if (err !== null) {
            console.log("exec error: " + err);
        }
    });
}


export const string_src = (filename, string) => {
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
