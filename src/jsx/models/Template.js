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
    ownedBy: User.Schema,
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

export const defaultRequirements = [
    {
        "title": "Offering Overview",
        "description": "Please describe what your offering is and how it can help our organization.  You can detail your offering in the \"Overview\" section.",
        "navLink": {
            "text": "Detail Offering",
            "type": "investment"
        }
    },
    {
        "title": "Add Pricing Information",
        "description": "In the \"Investment\" section, please submit the estimated cost needed to utilize your offering.  Feel free to include pricing details, such as CPM or per month in the Product/Service field",
        "navLink": {
            "text": "Add Pricing Information",
            "type": "investment"
        }
    },
    {
        "title": "Case Studies",
        "description": "Do you have case studies from companies similar to ours?  If so, please upload the case studies in the \"Documents\" section",
        "navLink": {
            "text": "Add Case Study",
            "type": "document"
        }
    },
    {
        "title": "Pitch Deck",
        "description": "If you have one readily available, please upload your offering's pitch deck.  The \"Documents\" section can handle Power Points, Keynote, and Google Slides",
        "navLink": {
            "text": "Upload Pitch Deck",
            "type": "document"
        }
    }
]

export default Template
