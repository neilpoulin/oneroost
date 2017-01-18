import Parse from "parse";
import { schema } from "normalizr"

export const className = "Account"
const Account = Parse.Object.extend(className);

export const Schema = new schema.Entity("accounts", {}, {
    idAttribute: (entity) => {
        return entity.objectId || entity.id || entity.get("objectId");
    }
});


export default Account;
