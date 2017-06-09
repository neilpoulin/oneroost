/*eslint no-console: 0*/
import Raven from "raven-js"
import version from "version.json"

export const NONE = 99
export const ERROR = 3
export const WARN = 2
export const INFO = 1
export const DEBUG = 0

let level = getLogLevel()
window.getVersion = function(){
    return version;
}

window.setLogLevel = function(newLevel){
    localStorage["oneroost/debug"] = newLevel
    level = getLogLevel()
    return level
}

window.getLogLevel = () => getLogLevel()

function getLogLevel() {
    try{
        let levelInput = localStorage["oneroost/debug"] || "ERROR"
        let currentLevel = level
        switch(levelInput.toUpperCase()){
            case "WARN":
                currentLevel = WARN
                break;
            case "ERROR":
                currentLevel = ERROR
                break;
            case "INFO":
                currentLevel = INFO
                break
            case "DEBUG":
                currentLevel = DEBUG
                break;
            default:
                currentLevel = ERROR
                break;
        }
        return currentLevel
    }
    catch(e){
        return ERROR
    }
}

export const getCurrentLogLevel = () => getLogLevel()

export const debug = (msg, data) => {
    if (level <= DEBUG && console){
        if (data){
            console.debug(msg, data)
        }
        else {
            console.debug(msg)
        }
    }
}

export const info = (msg, data) => {
    if (level <= INFO && console){
        if (data){            
            console.log(msg, data)
        }
        else {
            console.log(msg)
        }
    }
}

export const warn = (msg, data) => {
    if (level <= WARN && console){
        if (data){
            Raven.captureMessage(msg, data, {
                level: "warning" // one of 'info', 'warning', or 'error'
            });
            console.warn(msg, data)
        }
        else {
            Raven.captureMessage(msg, {
                level: "warning" // one of 'info', 'warning', or 'error'
            });
            console.warn(msg)
        }
    }
}

export const error = (msg, data) => {
    Raven.captureException(arguments)
    if (level <= ERROR && console){
        if (data){
            console.error(msg, data)
        }
        else {
            console.log(msg)
        }
    }
}
