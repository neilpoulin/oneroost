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
        stepQuery.get( req.object.id).then( function( step ){
            var author = step.get("createdBy");
            var deal = step.get("deal");
            var stakeholderQuery = new Parse.Query("Stakeholder");
            stakeholderQuery.include("user");
            stakeholderQuery.equalTo( "deal", deal );
            stakeholderQuery.find().then( function( stakeholders ){
                var recipients = EmailUtil.getRecipientsFromStakeholders( stakeholders, author.get("email") );
                var assignedUser = step.get("assignedUser");
                var author = step.get("createdBy");
                var assignedUserName = null
                if ( assignedUser )
                {
                    assignedUserName = assignedUser.get("firstName") + " " + assignedUser.get("lastName");
                }
                var status = "Not Done";
                if ( step.get("completedDate") != null )
                {
                    status = "Completed";
                }
                var data = {
                    dealName: deal.get("dealName"),
                    stepTitle: step.get("title"),
                    authorName: author.get("firstName") + " " + author.get("lastName"),
                    completedDate: step.get("completedDate"),
                    stepStatus: status,
                    assignedUserName: assignedUserName,
                    dueDate: deal.get("dueDate"),
                    description: deal.get("description")
                }

                console.log("sending Next Step after Save Email with data", data);
                EmailSender.sendEmail( "nextStepNotif", data, recipients, deal.id );
            });
        });
    }
}

function getText(step){
    var author = step.get("createdBy");
    var deal = step.get("deal");
    var assignedUser = step.get("assignedUser");
    var assignedUserName = null
    if ( assignedUser )
    {
        assignedUserName = assignedUser.get("firstName") + " " + assignedUser.get("lastName");
    }
    var status = "Not Done";
    if ( step.get("completedDate") != null )
    {
        status = "Completed";
    }
    var authorName = author.get("firstName") + " " + author.get("lastName");

    var text = authorName + " marked the next step " + step.get("title") + " as " + status + " on the roost " + deal.get("dealName") + "\n\n";
    text += step.get("description");
    if ( assignedUserName ){
        text += "\n\nAssigned To: " + assignedUserName
    }
    return text;
}

function getHtml(step){
    var author = step.get("createdBy");
    var deal = step.get("deal");
    var assignedUser = step.get("assignedUser");
    var assignedUserName = null
    if ( assignedUser )
    {
        assignedUserName = assignedUser.get("firstName") + " " + assignedUser.get("lastName");
    }
    var status = "Not Done";
    if ( step.get("completedDate") != null )
    {
        status = "Completed";
    }
    var authorName = author.get("firstName") + " " + author.get("lastName");

    var html = "<div><b>" + deal.get("dealName") + "</b> - " + authorName + " updated the next step <i>" + step.get("title") + "</i></div>"
        + "<div>Status: " + status + "<div/>";

    if ( step.get("description") )
    {
        html += "<div>Description: <p style='white-space: pre-wrap;'>" + step.get("description") + "</p></div>";
    }

    if ( assignedUserName ){
        html += "<div>Assigned To: " + assignedUserName+"</div>"
    }
    return html;
}

exports.afterSave = function(){
    Parse.Cloud.afterSave( "NextStep", function( req ){
        NotificationSettings.checkNotificationSettings(NotificationSettings.Settings.NEXT_STEP_EMAILS, true, getSender(req) )
    });
}
