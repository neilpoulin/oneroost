import Parse from "parse";
import { schema } from "normalizr"
import * as Deal from "models/Deal"
import * as User from "models/User"
import {processStrategy, idAttribute} from "models/modelUtil"

export const Schema = new schema.Entity("documents", {
    createdBy: User.Schema,
    deal: Deal.Schema
}, {
    idAttribute: idAttribute,
    processStrategy: processStrategy
});

export const className = "Document"

export default Parse.Object.extend(className);
