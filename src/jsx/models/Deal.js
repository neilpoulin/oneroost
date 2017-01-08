import Parse from "parse";

const Deal = Parse.Object.extend("Deal");

export default Deal;

exports.pointer = function(id){
    let deal = new Deal();
    deal.id = id;
    return deal;
}
