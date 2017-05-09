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
        "description": "Please describe what your offering is and how it can help our organization.  You can detail your offering in the \"Investment\" section.",
        "navLink": {
            "text": "Detail Offering",
            "type": "investment"
        }
    },
    {
        "title": "Add Investment Range",
        "description": "In the \"Investment\" section, please submit the desired investment amount needed to utilize your offering.  Feel free to include pricing details, such as CPM or per month in the Product/Service field",
        "navLink": {
            "text": "Investment Required",
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
        "title": "ROI Calculator",
        "description": "If possible, we'd like to access a Return on Investment calculator to get a better understanding of how your offering will impact our business.  The \"Documents\" section can accept excel files and Google Sheets.",
        "navLink": {
            "text": "Upload ROI Calculator",
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
    },
    {
        "title": "Proposal Submission",
        "description": "Have all the previous requirements been addressed for this opportunity? If yes, you can submit the opportunity to the company by navigating to the \"Participants\" section and clicking submit.  After you've done so, make sure to complete the associated Next Step  ",
        "navLink": {
            "text": "Submit Opportunity",
            "type": "participant"
        }
    }
]

export default Template
