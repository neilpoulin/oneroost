import Parse from "parse";
import { schema } from "normalizr"
import * as User from "models/User"
import * as Deal from "models/Deal"

export const Schema = new schema.Entity("comments", {
    createdBy: User.Schema,
    deal: Deal.Schema
}, {
    idAttribute: (entity) => {
        return entity.objectId || entity.id || entity.get("objectId");
    }
});


export const className = "DealComment"
const DealComment = Parse.Object.extend(className);
export const createQuery = () => new Parse.Query(className)
export default DealComment;
