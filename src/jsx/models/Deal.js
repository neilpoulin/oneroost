import Parse from "parse";
import { schema } from "normalizr"
import {copyJSON} from "RoostUtil"
import * as Account from "./Account"
import * as Template from "models/Template"
import * as User from "models/User"
import {processStrategy, idAttribute} from "models/modelUtil"

export const className = "Deal"
const Deal = Parse.Object.extend(className);

export const createQuery = () => {
    return new Parse.Query(className);
}

export const Schema = new schema.Entity(
    "deals",
    {
        createdBy: User.Schema,
        readyRoostUser: User.Schema,
        account: new schema.Entity("accounts", {}, {
            idAttribute: idAttribute,
            processStrategy: processStrategy

        }),
        template: Template.Schema,
        lastActiveUser: User.Schema,
    },
    {
        idAttribute: idAttribute,
        processStrategy: processStrategy,
    }
);

export const Pointer = (arg) => {
    if (!arg){
        return null
    }
    let dealId = arg
    if (typeof arg == "object"){
        dealId = arg.objectId || arg.id
    }
    else if (typeof arg == "string"){
        dealId = arg
    }
    return Deal.createWithoutData(dealId);
}

export const fromJS = (json) => {
    let deal = copyJSON(json);
    deal.createdBy = User.Pointer(deal.createdBy)
    deal.readyRoostUser = User.Pointer(deal.readyRoostUser)
    deal.account = Account.Pointer(deal.account)
    deal.template = Template.Pointer(deal.template)
    deal.lastActiveUser = User.Pointer(deal.lastActiveUser)
    return new Deal(deal)
}

export default Deal;
