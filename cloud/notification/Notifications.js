var CommentNotification = require("cloud/notification/Comment.js");
var NextStepNotification = require("cloud/notification/NextStep.js");
var StakeholderNotification = require("cloud/notification/Stakeholder.js");

exports.initialize = function()
{
    CommentNotification.afterSave();
    NextStepNotification.afterSave();
    StakeholderNotification.afterSave();
}
