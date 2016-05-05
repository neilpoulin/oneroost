var envUtil = require("./../util/envUtil.js");
var EmailSender = require("./../EmailSender.js");
var Template = require("./../email/MandrillEmailTemplate.js").Template;

var ParseCloud = require("parse-cloud-express");
var Parse = ParseCloud.Parse;
Parse.serverURL = envUtil.serverURL;

exports.afterSave = function(){
    Parse.Cloud.afterSave( "NextStep", function( req ){
        console.log("Next Step afterSave was triggered... ");
        var stepQuery = new Parse.Query("NextStep");
        stepQuery.include("deal");
        // stepQuery.include("createdBy"); //this fixed the issue where it didn"t know the properties of the author
        stepQuery.get( req.object.id).then( function( step ){
            var status = "Not Done";
            var templateName = "next-step-created";
            if ( step.get("completedDate") != null )
            {
                templateName = "next-step-completed";
                status = "Completed";
            }
            var author = step.get("createdBy");
            var deal = step.get("deal");
            var template = new Template( templateName );
            template.putGlobalVar( "step", step.toJSON() )
                .addRecipient({
                    email: author.get("email"),
                    name: author.get("username")
                })
                .putGlobalVar( "deal", step.get("deal").toJSON() )
                .putGlobalVar( "createdBy", step.get("createdBy").toJSON() )
                .setSubject( deal.get("dealName") + " - Next Step " + step.get("title") + " marked as " + status );
            console.log("sending Next Step after Save Email...");
            EmailSender.sendMandrillTemplate( template );
        }).then( function( error ){
            console.error( "failed to retrieve the next step: " + error );
        });
    });
}
