import Parse from "parse";
import { schema } from "normalizr"
import {copyJSON} from "RoostUtil"
import * as User from "models/User"
import {processStrategy, idAttribute} from "models/modelUtil"

export const className = "Template"
const Template = Parse.Object.extend(className)

export const Schema = new schema.Entity("templates", {
    createdBy: User.Schema,
    modifiedBy: User.Schema,
}, {
    idAttribute,
    processStrategy
})

export const fromJS = (json) => {
    let template = copyJSON(json)
    template.createdBy = User.Pointer(template.createdBy)
    template.modifiedBy = User.Pointer(template.modifiedBy)
    return new Template(template)
}

export default Template
