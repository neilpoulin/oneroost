var EmailUtil = require("./../util/EmailUtil.js");
var EmailSender = require("./../EmailSender.js");
var envUtil = require("./../util/envUtil.js");
var ParseCloud = require("parse-cloud-express");
var Parse = ParseCloud.Parse;
var NotificationSettings = require("./NotificationSettings");
Parse.serverURL = envUtil.serverURL;

function sendCommentEmail( comment ){
    var sender = function(){
        var deal = comment.get("deal");
        var author = comment.get("author");
        var authorEmail = author.get("email");
        var stakeholderQuery = new Parse.Query("Stakeholder");
        stakeholderQuery.include( "user" );
        stakeholderQuery.equalTo( "deal", deal );
        stakeholderQuery.find().then( function( stakeholders ){
            var recipients = EmailUtil.getRecipientsFromStakeholders( stakeholders, authorEmail );
            var dealLink = envUtil.getHost() + "/roosts/" + deal.id;
            var data = {
                authorName: author.get("firstName") + " " + author.get("lastName"),
                message: comment.get("message"),
                dealName: deal.get("dealName"),
                dealLink: dealLink,
                messageId: deal.id
            };
            EmailSender.sendTemplate( "commentNotif", data, recipients );
        });
    }
    NotificationSettings.checkNotificationSettings( NotificationSettings.Settings.COMMENT_EMAILS, true, sender );
}

exports.afterSave = function(io){
    var namespace = io.of("/DealComment");
    namespace.on("connection", function(socket){
        socket.on("deal", function(deal){
            socket.join(deal);
        });
    });

    var broadcast = function( comment )
    {
        var dealId = comment.get("deal").id;
        namespace.in(dealId).emit("comment", comment);
    }

    Parse.Cloud.afterSave( "DealComment", function( req, res ){
        var comment = req.object;
        /*
            this block is to send an email... TBD if we want to send these or not.
        */

        if ( comment.get("author") != null )
        {
            var query = new Parse.Query( "DealComment" );
            query.include("author");
            query.include("deal");
            query.get( comment.id, {
                success: function( comment ){
                    broadcast(comment);
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
