import Parse from "parse"
import { schema } from "normalizr"
import {copyJSON} from "RoostUtil"
import Account from "models/Account"
import {processStrategy, idAttribute} from "models/modelUtil"
import * as User from "models/User"

export const className = "AccountSeat"
const AccountSeat = Parse.Object.extend(className);

exports.Schema = new schema.Entity(
    "accountSeats", {
        user: User.Schema,
        account: new schema.Entity("accounts", {}, {
            idAttribute: idAttribute,
            processStrategy: processStrategy
        })
    },
    {
        idAttribute: idAttribute,
        processStrategy: processStrategy
    }
);

export const Pointer = (arg) => {
    if (!arg){
        return null
    }
    let accountSeatId = arg
    if (typeof arg == "object"){
        accountSeatId = arg.objectId || arg.id
    }
    else if (typeof arg == "string"){
        accountSeatId = arg
    }
    return AccountSeat.createWithoutData(accountSeatId);
}

export const fromJS = (json) => {
    let accountSeat = copyJSON(json);
    accountSeat.createdBy = User.Pointer(accountSeat.createdBy)
    accountSeat.account = Account.Pointer(accountSeat.account)
    accountSeat.user = User.Pointer(accountSeat.user)
    return new AccountSeat(accountSeat)
}

export default AccountSeat;
