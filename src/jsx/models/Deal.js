import Parse from "parse";
import { schema } from "normalizr"
import {Pointer as ModelPointer} from "models/Models"
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
    idAttribute: (entity) => {
        return entity.objectId || entity.id || entity.get("objectId");
    }
});

export const Pointer = (dealId) => {
    return ModelPointer(className, dealId);
}

export default Deal;
