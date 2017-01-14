import Parse from "parse";
import { schema } from "normalizr"
import {normalizeOpts} from "models/Models"
import * as User from "models/User"
import * as Deal from "models/Deal"

export const CommentSchema = new schema.Entity("comments", {
    createdBy: User.Schema,
    deal: Deal.Schema
}, {
    ...normalizeOpts
});


export const className = "DealComment"
const DealComment = Parse.Object.extend(className);

export default DealComment;
