import Deal from "models/Deal"
import Parse from "parse";

exports.Deal = Deal;


exports.Pointer = function(className, id){
    let type = Parse.Object.extend(className);
    let obj = new type();
    obj.id = id;
    return obj;
}
