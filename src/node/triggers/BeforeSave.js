import UserBeforeSave from "./UserBeforeSave"

exports.initialize = function(){
    console.log("setting up beforesave");
    UserBeforeSave.initialize();
}
