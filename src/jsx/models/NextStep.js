import Parse from "parse";
import { schema } from "normalizr"
import {normalizeOpts} from "models/Models"
import * as Deal from "models/Deal"
import * as User from "models/User"

export const Schema = new schema.Entity("nextSteps", {
    deal: Deal.Schema,
    createdBy: User.Schema,
    modifiedBy: User.Schema
}, {
    ...normalizeOpts
});

export const className = "NextStep";
const NextStep = Parse.Object.extend(className);

export default NextStep;
