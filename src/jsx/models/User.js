import Parse from "parse"
import { schema } from "normalizr"

export default Parse.User;

export const className = "_User"

export const Schema = new schema.Entity("users", {}, {
    idAttribute: (entity) => {
        return entity.objectId || entity.id || entity.get("objectId");
    }
});


export const Pointer = (arg) => {
    let userId = arg;
    if ( typeof arg == "object" ){
        userId = arg.objectId || arg.id
    }
    return Parse.User.createWithoutData(userId);
}
