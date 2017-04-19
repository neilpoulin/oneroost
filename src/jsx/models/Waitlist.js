import Parse from "parse"
import { schema } from "normalizr"
import {copyJSON} from "RoostUtil"
import {processStrategy, idAttribute} from "models/modelUtil"

export const className = "Waitlist"
const Waitlist = Parse.Object.extend(className);

exports.Schema = new schema.Entity(
    "waitlists", {

    },
    {
        idAttribute: idAttribute,
        processStrategy: processStrategy
    }
);

export const Pointer = (arg) => {
    if (!arg){
        return null
    }
    let objectId = arg
    if (typeof arg == "object"){
        objectId = arg.objectId || arg.id
    }
    else if (typeof arg == "string"){
        objectId = arg
    }
    return Waitlist.createWithoutData(objectId);
}

export const fromJS = (json) => {
    let waitlist = copyJSON(json);
    return new Waitlist(waitlist)
}

export default Waitlist;
