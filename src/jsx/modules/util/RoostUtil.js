import Parse from "parse"

exports.getCurrentUser = function(){
    return Parse.User.current();
}

exports.getFullName = function( parseUser ){
    var fullName = parseUser.get("firstName") + " " + parseUser.get("lastName")
    return fullName.trim()
}
