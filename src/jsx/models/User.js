import Parse from "parse"
import { schema } from "normalizr"
import {processStrategy, idAttribute} from "models/modelUtil"


export const className = "_User"

export const Schema = new schema.Entity("users", {}, {
    idAttribute: idAttribute,
    processStrategy: processStrategy
});


export const Pointer = (arg) => {
    if ( !arg ){
        return null
    }
    let userId = arg;
    if ( typeof arg == "object" ){
        userId = arg.objectId || arg.id
    } else if ( typeof arg == "string" ){
        userId = arg
    }
    return Parse.User.createWithoutData(userId);
}

export default Parse.User;
