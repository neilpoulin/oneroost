import Deal from "models/Deal"
import Parse from "parse";

exports.Deal = Deal;

export const processStrategy = (entity) => {
    if ( entity instanceof Parse.Object ){
        let json = entity.toJSON()
        json.className = entity.className
        return json
    }
    return entity;
}

export const idAttribute = (entity) => entity.objectId || entity.id;

export const normalizeOpts = {
    processStrategy,
    idAttribute
}

exports.Pointer = function(className, id, opts){
    let type = Parse.Object.extend(className);
    let obj = new type();
    obj.id = id;

    if (opts){
        obj.set(opts);
    }

    return obj;
}
