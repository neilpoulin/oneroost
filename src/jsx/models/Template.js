import Parse from "parse";
import { schema } from "normalizr"
import {copyJSON} from "RoostUtil"
import * as User from "models/User"
import * as Account from "models/Account"
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
    template.ownedBy = User.Pointer(template.ownedBy)
    template.account = Account.Pointer(template.account)
    return new Template(template)
}

export const Pointer = (arg) => {
    if (!arg){
        return null
    }
    let userId = arg;
    if (typeof arg == "object"){
        userId = arg.objectId || arg.id
    }
    else if (typeof arg == "string"){
        userId = arg
    }
    if (!userId) return null
    return { "__type": "Pointer", "className": className, "objectId": userId } ;
}

export default Template
