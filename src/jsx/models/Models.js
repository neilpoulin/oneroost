import Deal from "models/Deal"
import Parse from "parse";

exports.Deal = Deal;


exports.Pointer = function(className, id, opts){
    let type = Parse.Object.extend(className);
    let obj = new type();
    obj.id = id;

    if (opts){
        obj.set(opts);
    }
    
    return obj;
}
