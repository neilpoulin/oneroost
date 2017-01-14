import Parse from "parse";
import { schema } from "normalizr"
import {Pointer as ModelPointer, normalizeOpts} from "models/Models"
import * as User from "models/User"

export const className = "Deal"
const Deal = Parse.Object.extend(className);

exports.createQuery = function(){
    return new Parse.Query(className);
}

export const Schema = new schema.Entity("deals", {
    createdBy: User.Schema,
    readyRoostUser: User.Schema
}, {
    processStrategy: (entity) => {
        if ( entity instanceof Parse.Object ){
            let json = entity.toJSON()
            json.className = entity.className
            return json
        }
        return entity;
    },
    idAttribute: (entity) => entity.objectId || entity.id
});

export const Pointer = (dealId) => {
    return ModelPointer(className, dealId);
}

export default Deal;
