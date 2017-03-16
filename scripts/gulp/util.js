import path from "path"
import gutil from "gulp-util"
export const baseDir = path.join(__dirname, "..", "..")

export const getWebpackConfig = (name="") => {
    let configPath = path.join(baseDir, `webpack.${name}.config.babel.js`)
    console.log("Getting Webpack config for " + name + " = " + configPath);
    let config = require(configPath);
    console.log(config)
    return config;
}
