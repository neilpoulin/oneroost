var envUtil = require("./../util/envUtil.js");

var ParseCloud = require("parse-cloud-express");
var Parse = ParseCloud.Parse;
Parse.serverURL = envUtil.serverURL;

exports.initialize = function(){
    // not needed since we're lowercasing on login on the client.
    // Also, if we add this, we can't do email validation
    // I left a comment about this possible bug here:
    // https://github.com/parse-community/parse-server/issues/275
}
