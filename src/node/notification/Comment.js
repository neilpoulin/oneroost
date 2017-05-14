import EmailUtil from "./../util/EmailUtil.js"
import EmailSender from "./../EmailSender.js"
import envUtil from "./../util/envUtil.js"
import {Parse} from "parse-cloud-express"
import NotificationSettings from "./NotificationSettings"
import Raven from "raven"

Parse.serverURL = envUtil.serverURL;

async function sendCommentEmail(comment){
    console.log("preparing DealComment email notification");
    try{
        let sendNotification = await NotificationSettings.getNotificationSetting(NotificationSettings.Settings.COMMENT_EMAILS)
        if (sendNotification){
            var deal = comment.get("deal");
            var author = comment.get("author");
            var authorEmail = author.get("email");
            // console.log("comment", comment.toJSON());
            // console.log("author", author.toJSON());
            console.log("authorEmail", authorEmail);
            console.log("author.email", author.get("email"));

            // var stakeholderQuery = new Parse.Query("Stakeholder");
            // stakeholderQuery.include( "user" );
            // stakeholderQuery.equalTo( "deal", deal );
            // let stakeholders = await stakeholderQuery.find();
            // var recipients = EmailUtil.getRecipientsFromStakeholders( stakeholders, authorEmail );
            let recipients = await EmailUtil.getActualRecipientsForDeal(deal, authorEmail);
            var dealLink = envUtil.getHost() + "/roosts/" + deal.id;
            var data = {
                message: comment.get("message"),
                dealName: deal.get("dealName"),
                author: author.toJSON(),
                dealLink: dealLink,
                messageId: deal.id
            };
            EmailSender.sendTemplate("commentNotif", data, recipients);
        }
    }
    catch(e){
        console.error("something went wrong with the comment sender", e);
        Raven.captureException(e)
    }
}

exports.afterSave = function(io){
    var namespace = io.of("/DealComment");
    namespace.on("connection", function(socket){
        socket.on("deal", function(deal){
            socket.join(deal);
        });
    });

    var broadcast = function(comment){
        console.log("broadcasting comment to all websocket clients")
        var dealId = comment.get("deal").id;
        namespace.in(dealId).emit("comment", comment);
    }

    Parse.Cloud.afterSave("DealComment", function(req, res){
        var comment = req.object;
        /*
        this block is to send an email... TBD if we want to send these or not.
        */

        try{
            comment.get("deal").set({
                lastActiveAt: new Date(),
                lastActiveUser: req.user
            }).save().then(saved => {
                console.log("successfully saved deal after comment save");
            }).catch(Raven.captureException)
        }
        catch (e){
            console.error("Failed to update deal with last activity date", e)
            Raven.captureException(e);
        }

        if (comment.get("author") != null) {
            var query = new Parse.Query("DealComment");
            query.include("author");
            query.include("deal");
            query.get(comment.id, {
                useMasterKey: true,
                success: function(comment){
                    broadcast(comment);
                    sendCommentEmail(comment);
                },
                error: function(error){
                    console.error("failed to get the deal from the comment.", error);
                    Raven.captureException(error)
                }
            });
        }
        else {
            console.log("not sending deal comment email as the author was null");
        }
    }, function(error){
        console.error("failed to execute DealComment query.", error);
        Raven.captureException(error)
    });
}
