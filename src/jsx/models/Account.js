import Parse from "parse"
import { schema } from "normalizr"
import {copyJSON} from "RoostUtil"
import {processStrategy, idAttribute} from "models/modelUtil"
import * as User from "models/User"

export const className = "Account"
const Account = Parse.Object.extend(className);

exports.Schema = new schema.Entity(
    "accounts", {

    },
    {
        idAttribute: idAttribute,
        processStrategy: processStrategy
    }
);

export const Pointer = (arg) => {
    if (!arg ){
        return null
    }
    let accountId = arg
    if ( typeof arg == "object" ){
        accountId = arg.objectId || arg.id
    } else if ( typeof arg == "string"){
        accountId = arg
    }
    return Account.createWithoutData(accountId);
}


export const fromJS = (json) => {
    let account = copyJSON(json);
    account.createdBy = User.Pointer(account.createdBy)
    return new Account(account)
}

export default Account;
