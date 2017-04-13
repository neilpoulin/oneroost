import Parse from "parse";
import { schema } from "normalizr"
import * as User from "models/User"
import * as Deal from "models/Deal"
import {processStrategy, idAttribute} from "models/modelUtil"
import {copyJSON} from "RoostUtil"

export const className = "DealComment"
const DealComment = Parse.Object.extend(className);

export const Schema = new schema.Entity("comments", {
    createdBy: User.Schema,
    deal: Deal.Schema
}, {
    idAttribute: idAttribute,
    processStrategy: processStrategy,
});

export const createQuery = () => new Parse.Query(className)
export default DealComment;

export const fromJS = (json) => {
    let comment = copyJSON(json);
    comment.author = User.Pointer(comment.author)
    comment.deal = Deal.Pointer(comment.deal)
    return new DealComment(comment)
}
