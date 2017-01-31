import Parse from "parse";
import { schema } from "normalizr"
import * as Deal from "models/Deal"
import * as User from "models/User"
import {copyJSON} from "RoostUtil"
import {processStrategy, idAttribute} from "models/modelUtil"

export const Schema = new schema.Entity("documents", {
    createdBy: User.Schema,
    deal: Deal.Schema
}, {
    idAttribute: idAttribute,
    processStrategy: processStrategy
});

export const className = "Document"
export const Document = Parse.Object.extend(className)
export default Document

export const fromJS = (json) => {
    let doc = copyJSON(json);
    doc.createdBy = User.Pointer(doc.createdBy)
    doc.deal = Deal.Pointer(doc.deal)
    return new Document(doc)
}
