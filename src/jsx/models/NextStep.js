import Parse from "parse";
import { schema } from "normalizr"
import * as Deal from "models/Deal"
import * as User from "models/User"

export const Schema = new schema.Entity("nextSteps", {
    deal: Deal.Schema,
    createdBy: User.Schema,
    modifiedBy: User.Schema,
    assignedUser: User.Schema,
}, {
    idAttribute: (entity) => {
        return entity.objectId || entity.id || entity.get("objectId");
    }
});

export const className = "NextStep";
const NextStep = Parse.Object.extend(className);

export default NextStep;
