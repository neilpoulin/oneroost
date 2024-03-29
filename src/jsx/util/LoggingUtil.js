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
    try{
        if (localStorage){
            localStorage["oneroost/debug"] = newLevel
            level = getLogLevel()
            return level
        }
    }
    catch (e){
        // do nothing.. that's ok.
    }
    return level
}

window.getLogLevel = () => getLogLevel()

function getLogLevel() {
    try{
        if (!localStorage) return ERROR
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
    if (Raven && data){
        Raven.captureMessage(msg, data, {
            level: "warning" // one of 'info', 'warning', or 'error'
        });
    }
    else if (Raven){
        Raven.captureMessage(msg, {
            level: "warning" // one of 'info', 'warning', or 'error'
        });
    }
    if (level <= WARN && console){
        if (msg && data){
            console.warn(msg, data)
        }
        else{
            console.warn(msg)
        }
    }
}

export const error = (msg, data) => {
    if (Raven){
        Raven.captureException(arguments)
    }
    if (level <= ERROR && console){
        if (data){
            console.error(msg, data)
        }
        else {
            console.error(msg)
        }
    }
}
