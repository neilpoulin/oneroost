import Parse from "parse";
import { schema } from "normalizr"
import {copyJSON} from "RoostUtil"
import * as Deal from "models/Deal"
import * as User from "models/User"
import {processStrategy, idAttribute} from "models/modelUtil"

export const className = "NextStep";
const NextStep = Parse.Object.extend(className);

export const Schema = new schema.Entity("nextSteps", {
    deal: Deal.Schema,
    createdBy: User.Schema,
    modifiedBy: User.Schema,
    assignedUser: User.Schema,
}, {
    idAttribute: idAttribute,
    processStrategy: processStrategy
});

export const fromJS = (json) => {
    let step = copyJSON(json)
    step.deal = Deal.Pointer(step.deal)
    step.createdBy = User.Pointer(step.createdBy)
    step.modifiedBy = User.Pointer(step.modifiedBy)
    step.assignedUser = User.Pointer(step.assignedUser)
    //todo: take this out when we can...
    if ( step.author){
        console.warn("step has Author, which is not valid", step)
        delete step["author"]
    }

    return new NextStep(step)
}

export default NextStep;
