var EmailUtil = require("./../util/EmailUtil.js");
var EmailSender = require("./../EmailSender.js");
var Template = require("./../email/MandrillEmailTemplate.js").Template;
var envUtil = require('./../util/envUtil.js');
var ParseCloud = require('parse-cloud-express');
var Parse = ParseCloud.Parse;
Parse.serverURL = envUtil.serverURL;

exports.afterSave = function(){
    Parse.Cloud.afterSave( 'DealComment', function( req, res ){
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

function sendCommentEmail( comment ){
    var deal = comment.get("deal");
    var author = comment.get("author");
    var recipients = [];
    var authorEmail = author.get("email");
    var stakeholderQuery = new Parse.Query("Stakeholder");
    stakeholderQuery.include( "user" );
    stakeholderQuery.equalTo( "deal", deal );
    stakeholderQuery.find().then( function( stakeholders ){
        console.log( "building MandrillEmailTemplate " );
        var recipients = EmailUtil.getRecipientsFromStakeholders( stakeholders, authorEmail );

        console.log( "successfully parsed recipients");
        var template = new Template( "commentnotification" );

        console.log( "setting up template");
        console.log( JSON.stringify( deal.toJSON() ) );
        template.setRecipients( recipients )
            .putGlobalVar( "deal", deal.toJSON() )
            .putGlobalVar( "author", author.toJSON() )
            .putGlobalVar( "comment", comment.toJSON() )
            .setSubject( deal.dealName +  " - New Comment from " + comment.get("username") );

        console.log("attempting to send via templates");
        EmailSender.sendMandrillTemplate( template );
    });
}
