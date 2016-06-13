var CommentNotification = require("./Comment.js");
var NextStepNotification = require("./NextStep.js");
var StakeholderNotification = require("./Stakeholder.js");

var envUtil = require("./../util/envUtil.js");
var ParseCloud = require("parse-cloud-express");
var Parse = ParseCloud.Parse;
Parse.serverURL = envUtil.serverURL;

exports.initialize = function(io)
{
    CommentNotification.afterSave(io);
    NextStepNotification.afterSave(io);
    StakeholderNotification.afterSave(io);
}
