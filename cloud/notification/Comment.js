var EmailUtil = require("./../util/EmailUtil.js");
var EmailSender = require("./../EmailSender.js");
var envUtil = require("./../util/envUtil.js");
var ParseCloud = require("parse-cloud-express");
var Parse = ParseCloud.Parse;
Parse.serverURL = envUtil.serverURL;


function sendCommentEmail( comment ){
    var deal = comment.get("deal");
    var author = comment.get("author");
    var authorEmail = author.get("email");
    var stakeholderQuery = new Parse.Query("Stakeholder");
    stakeholderQuery.include( "user" );
    stakeholderQuery.equalTo( "deal", deal );
    stakeholderQuery.find().then( function( stakeholders ){
        var recipients = EmailUtil.getRecipientsFromStakeholders( stakeholders, authorEmail );
        var dealLink = (process.env.PARSE_SERVER_URL || "http://localhost") + ":1337/deals/" + deal.id;
        var message = {
            subject: deal.get("dealName") + " - New Comment from " + author.get("firstName") + " " + author.get("lastName"),
            text: deal.get("dealName") + " - New Comment from " + author.get("firstName") + " " + author.get("lastName") + "\n\nmessage: " + comment.get("message") + "\nLink: " + dealLink,
            html: deal.get("dealName") + " - New Comment from " + author.get("firstName") + " " + author.get("lastName") + "<br/><br/>message: " + comment.get("message") + "<br/><a href='" + dealLink + "'>" + dealLink + "</a>"
        }
        EmailSender.sendEmail( message, recipients );
    });
}

exports.afterSave = function(){
    Parse.Cloud.afterSave( "DealComment", function( req, res ){
        console.log("DealComment afterSave triggered");
        var comment = req.object;
        if ( comment.get("author") != null )
        {
            var query = new Parse.Query( "DealComment" );
            query.include("author");
            query.include("deal");
            query.get( comment.id, {
                success: function( comment ){
                    sendCommentEmail( comment );
                },
                error: function(){
                    console.error("failed to get the deal from the comment.");
                }
            } );
        }
        else {
            console.log("not sending deal comment email as the author was null");
        }
    });
}
