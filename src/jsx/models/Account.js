import Parse from "parse";
import {normalizeOpts} from "models/Models"
import { schema } from "normalizr"

export const className = "Account"
const Account = Parse.Object.extend(className);

export const AccountSchema = new schema.Entity("accounts", {}, {    
    ...normalizeOpts
});


export default Account;
