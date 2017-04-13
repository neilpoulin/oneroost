import {copyJSON, transformDatesInObject} from "RoostUtil"

export const processStrategy = (entity) => {
    let copy = copyJSON(entity);
    delete copy["__type"]
    copy = transformDatesInObject(copy)

    return copy
}

export const idAttribute = (entity) => {
    return entity.objectId || entity.id || entity.get("objectId");
}

export const TEST_STRING = "TESTING"

export const Pointer = (className, arg) => {
    if (!arg){
        return null
    }
    let objectId = arg;
    if (typeof arg == "object"){
        objectId = arg.objectId || arg.id
    }
    else if (typeof arg == "string"){
        objectId = arg
    }
    if (!objectId) return null
    return { "__type": "Pointer", "className": className, "objectId": objectId } ;
}
