import Parse from "parse";
import { schema } from "normalizr"
import * as Deal from "models/Deal"
import * as User from "models/User"
import {processStrategy, idAttribute} from "models/modelUtil"

export const Schema = new schema.Entity("stakeholders", {
    creatdBy: User.Schema,
    deal: Deal.Schema
}, {
    idAttribute: idAttribute,
    processStrategy: processStrategy
});

export const className = "Stakeholder"
const Stakeholder = Parse.Object.extend(className);

export default Stakeholder;
