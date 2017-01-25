import Parse from "parse"
import { schema } from "normalizr"
import {processStrategy, idAttribute} from "models/modelUtil"

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


export default Account;
