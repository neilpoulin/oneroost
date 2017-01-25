import Parse from "parse";
import {copyJSON} from "RoostUtil"

export const processStrategy = (entity) => {
    let copy = copyJSON(entity);
    delete copy["__type"]
    return copy
}


export const idAttribute = (entity) => {
    return entity.objectId || entity.id || entity.get("objectId");
}

export const TEST_STRING = "TESTING"


exports.Pointer = function(className, id, opts){
    let type = Parse.Object.extend(className);
    let obj = new type();
    obj.id = id;

    if (opts){
        obj.set(opts);
    }

    return obj;
}
