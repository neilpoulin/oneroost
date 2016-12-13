var envUtil = require("./../util/envUtil.js");

var ParseCloud = require("parse-cloud-express");
var Parse = ParseCloud.Parse;
Parse.serverURL = envUtil.serverURL;

exports.initialize = function(){
    console.log("register parse cloud beforeSave for User");
    Parse.Cloud.beforeSave(Parse.User, function(request, response) {
        console.log("user before save triggered");
        let email = request.object.get("email")
        if (email){
            request.object.set("email", email.toLowerCase());
        }
        let username = request.object.get("username");
        if (username){
            request.object.set("username", username.toLowerCase())
        }
        response.success();
    });

}
