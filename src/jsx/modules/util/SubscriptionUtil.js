import _ from "lodash"


exports.updateById = function(items, changed){
    let index = _.indexOf(items, _.find(items, {id: changed.id}));
    items.slice(index, 1, changed);
}

exports.removeItem = function(items, removed){
    let index = _.indexOf(items, _.find(items, {id: removed.id}));
    items.splice(index, 1);
}
