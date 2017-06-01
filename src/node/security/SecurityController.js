var envUtil = require("./../util/envUtil.js");
var ParseCloud = require("parse-cloud-express");
var crypto = require("crypto");
var Parse = ParseCloud.Parse;

exports.initialize = function(){
    console.log("Initializing SecurityController")
    Parse.Cloud.define("getIntercomHMAC", function(request, response) {
        var currentUser = request.user;
        if(currentUser){
            const userId = currentUser.id
            const hmac = crypto.createHmac("sha256", envUtil.getIntercomSecretKey());
            hmac.update(userId);
            let hmacString = hmac.digest("hex")
            console.log("Created hmac for user", userId);
            return response.success({hmac: hmacString})
        }
        else {
            console.log("No user was found for the given request. Not generating an HMAC.")
        }
        return response.success()
    });
}
