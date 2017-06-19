import Parse from "parse"
import { schema } from "normalizr"
import {copyJSON} from "RoostUtil"
import * as Template from "models/Template"
import {processStrategy, idAttribute} from "models/modelUtil"

export const className = "BrandPage"
const BrandPage = Parse.Object.extend(className);

exports.Schema = new schema.Entity(
    "brands", {
        templateIds: [Template.Schema]
    },
    {
        idAttribute: idAttribute,
        processStrategy: processStrategy
    }
);

export const Pointer = (arg) => {
    if (!arg){
        return null
    }
    let brandPageId = arg
    if (typeof arg == "object"){
        brandPageId = arg.objectId || arg.id
    }
    else if (typeof arg == "string"){
        brandPageId = arg
    }
    return BrandPage.createWithoutData(brandPageId);
}

export const fromJS = (json) => {
    let brand = copyJSON(json);
    brand.templateIds = brand.templateIds.map(Template.Pointer)
    return new BrandPage(brand)
}

export default BrandPage;
