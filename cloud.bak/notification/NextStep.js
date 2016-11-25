var envUtil = require("./../util/envUtil.js");
var EmailSender = require("./../EmailSender.js");
var EmailUtil = require("./../util/EmailUtil.js");
var NotificationSettings = require("./NotificationSettings")

var ParseCloud = require("parse-cloud-express");
var Parse = ParseCloud.Parse;
Parse.serverURL = envUtil.serverURL;

function getSender( req ){
    return function(){
        console.log("Next Step afterSave was triggered... ");
        var stepQuery = new Parse.Query("NextStep");
        stepQuery.include("deal");
        stepQuery.include("createdBy"); //this fixed the issue where it didn"t know the properties of the author
        stepQuery.include("assignedUser");
        stepQuery.include("modifiedBy");
        stepQuery.get( req.object.id).then( function( step ){
            var author = step.get("createdBy");
            var deal = step.get("deal");
            var stakeholderQuery = new Parse.Query("Stakeholder");
            var assignedUser = step.get("assignedUser");
            var modifiedBy = step.get("modifiedBy");
            stakeholderQuery.include("user");
            stakeholderQuery.equalTo( "deal", deal );
            stakeholderQuery.find().then( function( stakeholders ){
                var assignedUserName = null
                if ( assignedUser )
                {
                    assignedUserName = assignedUser.get("firstName") + " " + assignedUser.get("lastName");
                }

                var modifiedByName = null
                if ( modifiedBy ){
                    modifiedByName = modifiedBy.get("firstName") + " " + modifiedBy.get("lastName");
                }

                var status = "Not Done";
                if ( step.get("completedDate") != null )
                {
                    status = "Completed";
                }
                var data = {
                    dealName: deal.get("dealName"),
                    modifiedByName: modifiedByName,
                    stepTitle: step.get("title"),
                    authorName: author.get("firstName") + " " + author.get("lastName"),
                    completedDate: step.get("completedDate"),
                    stepStatus: status,
                    assignedUserName: assignedUserName,
                    dueDate: deal.get("dueDate"),
                    description: step.get("description"),
                    dealLink: envUtil.getHost() + "/roosts/" + deal.id,
                    messageId: deal.id
                }
                console.log("sending Next Step after Save Email with data", data);
                var recipients = EmailUtil.getRecipientsFromStakeholders( stakeholders, author.get("email") );
                EmailSender.sendTemplate( "nextStepNotif", data, recipients );
            });
        });
    }
}

exports.afterSave = function(){
    Parse.Cloud.afterSave( "NextStep", function( req ){
        NotificationSettings.checkNotificationSettings(NotificationSettings.Settings.NEXT_STEP_EMAILS, true, getSender(req) )
    });
}
