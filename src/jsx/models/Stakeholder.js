import Parse from "parse";
import { schema } from "normalizr"
import {normalizeOpts} from "models/Models"
import * as Deal from "models/Deal"
import * as User from "models/User"

export const Schema = new schema.Entity("stakeholders", {
    creatdBy: User.Schema,
    deal: Deal.Schema
}, {
    ...normalizeOpts
});

export const className = "Stakeholder"
const Stakeholder = Parse.Object.extend(className);

export default Stakeholder;
