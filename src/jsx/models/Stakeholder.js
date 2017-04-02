import Parse from "parse";
import { schema } from "normalizr"
import * as Deal from "models/Deal"
import * as User from "models/User"
import {copyJSON} from "RoostUtil"
import {processStrategy, idAttribute} from "models/modelUtil"

export const Schema = new schema.Entity("stakeholders", {
    creatdBy: User.Schema,
    deal: Deal.Schema,
    user: User.Schema,
    modifiedBy: User.Schema,
    invitedBy: User.Schema,
}, {
    idAttribute: idAttribute,
    processStrategy: processStrategy
});

export const className = "Stakeholder"
const Stakeholder = Parse.Object.extend(className);

export const fromJSON = (json) => {
    let stakeholder = copyJSON(json);
    stakeholder.createdBy = User.Pointer(stakeholder.createdBy)
    stakeholder.deal = Deal.Pointer(stakeholder.deal)
    stakeholder.modifiedBy = User.Pointer(stakeholder.modifiedBy)
    stakeholder.invitedBy = User.Pointer(stakeholder.invitedBy)
    stakeholder.user = User.Pointer(stakeholder.user)
    return new Stakeholder(stakeholder)
}

export default Stakeholder;
