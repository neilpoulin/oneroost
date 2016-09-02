var EmailUtil = require("./../util/EmailUtil.js");
var EmailSender = require("./../EmailSender.js");
var envUtil = require("./../util/envUtil.js");
var ParseCloud = require("parse-cloud-express");
var Parse = ParseCloud.Parse;
var NotificationSettings = require("./NotificationSettings");
Parse.serverURL = envUtil.serverURL;



exports.afterSave = function(){
    Parse.Cloud.afterSave( "Document", function( req ){
        NotificationSettings.checkNotificationSettings(NotificationSettings.Settings.DOCUMENT_ADDED_EMAILS, true, getSender(req) )
    });
}

function getSender(req){
    return function(){
        console.log("Document after save was triggered");
        var documentId = req.object.id;
        var documentQuery = new Parse.Query("Document");
        documentQuery.include("deal");
        documentQuery.include("createdBy")
        documentQuery.get( documentId ).then( function(doc){
            var deal = doc.get("deal");
            var uploadedBy = doc.get("createdBy");
            var stakeholderQuery = new Parse.Query("Stakeholder");
            stakeholderQuery.include("user");
            stakeholderQuery.equalTo( "deal", deal );
            stakeholderQuery.find().then( function( stakeholders ){
                var data = {
                    firstName: uploadedBy.get("firstName"),
                    lastName: uploadedBy.get("lastName"),
                    dealName: deal.get("dealName"),
                    documentName: doc.get("fileName"),
                    icon: null,
                    dealLink: envUtil.getHost() + "/roosts/" + deal.id,
                    messageId: deal.id,
                };
                console.log("sending Document after save email with data", data);
                var recipients = EmailUtil.getRecipientsFromStakeholders( stakeholders, uploadedBy.get("email") );
                EmailSender.sendTemplate( "documentAddedNotif", data, recipients );
            });
        });
    }
}
