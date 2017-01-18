import Parse from "parse"
import { schema } from "normalizr"
import {Pointer as ModelPointer} from "models/Models"

export default Parse.User;

export const className = "User"

export const Schema = new schema.Entity("users", {}, {
    idAttribute: (entity) => {
        return entity.objectId || entity.id || entity.get("objectId");
    }
});


export const Pointer = (dealId) => {
    return ModelPointer(className, dealId);
}
