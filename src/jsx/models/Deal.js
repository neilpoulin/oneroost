import Parse from "parse";
import { schema } from "normalizr"
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

export const Pointer = (arg) => {
    let dealId = arg
    if ( typeof arg == "object" ){
        dealId = arg.objectId || arg.id
    }
    return Deal.createWithoutData(dealId);
}

export default Deal;
