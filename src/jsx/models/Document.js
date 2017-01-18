import Parse from "parse";
import { schema } from "normalizr"
import * as Deal from "models/Deal"
import * as User from "models/User"

export const Schema = new schema.Entity("documents", {
    createdBy: User.Schema,
    deal: Deal.Schema
}, {
    idAttribute: (entity) => {
        return entity.objectId || entity.id || entity.get("objectId");
    }
});

export const className = "Document"

export default Parse.Object.extend(className);
