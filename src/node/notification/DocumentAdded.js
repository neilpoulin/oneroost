
var EmailUtil = require("./../util/EmailUtil.js");
var EmailSender = require("./../EmailSender.js");
var envUtil = require("./../util/envUtil.js");
var ParseCloud = require("parse-cloud-express");
var Parse = ParseCloud.Parse;
var NotificationSettings = require("./NotificationSettings");
var Documents = require("./../documents/Documents.js");
Parse.serverURL = envUtil.serverURL;



exports.afterSave = function(){
    Parse.Cloud.afterSave( "Document", async function( req ){
        try{
            console.log("after save of document triggered")
            let sendNotification = await NotificationSettings.getNotificationSetting(NotificationSettings.Settings.DOCUMENT_ADDED_EMAILS)

            let isOnboardingDoc = req.object.get("onboarding");
            console.log("onboarding", isOnboardingDoc);
            if ( isOnboardingDoc == true ){
                console.log("this is an onboarding document, not sending email.");
                return;
            }

            if ( sendNotification ){
                console.log("Document after save was triggered");
                var documentId = req.object.id;
                console.log("document id = " + documentId);

                var documentQuery = new Parse.Query("Document");
                documentQuery.include("deal");
                documentQuery.include("createdBy");
                // documentQuery.equalTo("onboarding", false);
                let doc = await documentQuery.get( documentId, {useMasterKey: true} )

                console.log("found document: ", doc.toJSON());
                var deal = doc.get("deal");
                var uploadedBy = doc.get("createdBy");
                var stakeholders = await getStakeholdersForDeal(deal);
                var attachments = [];
                if ( doc.get("s3key") && !doc.get("externalLink"))
                {
                    let s3Object = await Documents.getS3Object(doc.get("s3key") );
                    var attachment = {
                        content: s3Object.Body,
                        contentType: doc.get("type"),
                        filename: doc.get("fileName") + "." + doc.get("fileExtension")
                        // cid: doc.id //TODO:used if we want inline images (maybe we do someday)
                    };
                    attachments.push(attachment);
                }

                var data = {                    
                    user: uploadedBy.toJSON(),
                    dealName: deal.get("dealName"),
                    documentName: doc.get("fileName"),
                    externalLink: doc.get("externalLink"),
                    icon: null,
                    dealLink: envUtil.getHost() + "/roosts/" + deal.id,
                    messageId: deal.id,
                    attachments: attachments
                };
                console.log("sending Document after save email with data", data);
                var recipients = EmailUtil.getRecipientsFromStakeholders( stakeholders, uploadedBy.get("email") );
                EmailSender.sendTemplate( "documentAddedNotif", data, recipients );
            }
            else {
                console.log("not sending email since the value was not true", sendNotification)
            }
        }
        catch(e){
            console.error("Something unexpected happened in the Document after save trigger", e);
        }

    });
}

async function getStakeholdersForDeal( deal ){
    var stakeholderQuery = new Parse.Query("Stakeholder");
    stakeholderQuery.include("user");
    stakeholderQuery.equalTo( "deal", deal );
    return stakeholderQuery.find({useMasterKey: true});
}
