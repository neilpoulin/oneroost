import Parse from "parse";
import { schema } from "normalizr"
import {copyJSON} from "RoostUtil"
import * as Deal from "models/Deal"
import * as User from "models/User"
import {processStrategy, idAttribute} from "models/modelUtil"

export const className = "Requirement"
const Requirement = Parse.Object.extend(className)

export const Schema = new schema.Entity("requirements", {
    deal: Deal.Schema,
    createdBy: User.Schema,
    modifiedBy: User.Schema,
}, {
    idAttribute: idAttribute,
    processStrategy: processStrategy
})

export const fromJS = (json) => {
    let requirement = copyJSON(json)
    requirement.deal = Deal.Pointer(requirement.deal)
    requirement.createdBy = User.Pointer(requirement.createdBy)
    requirement.modifiedBy = User.Pointer(requirement.modifiedBy)
    return new Requirement(requirement)
}

export default Requirement;
