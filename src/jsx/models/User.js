import Parse from "parse"
import { schema } from "normalizr"
import {Pointer as ModelPointer, normalizeOpts} from "models/Models"

export default Parse.User;

export const className = "User"

export const Schema = new schema.Entity("users", {}, {
    ...normalizeOpts
});


export const Pointer = (dealId) => {
    return ModelPointer(className, dealId);
}
