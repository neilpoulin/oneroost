var envUtil = require("./../util/envUtil.js");
var EmailSender = require("./../EmailSender.js");
var EmailUtil = require("./../util/EmailUtil.js");
var NotificationSettings = require("./NotificationSettings")
var ParseCloud = require("parse-cloud-express");
import Raven from "raven"
var Parse = ParseCloud.Parse;
Parse.serverURL = envUtil.serverURL;

exports.afterSave = function(){
    Parse.Cloud.afterSave("NextStep", async function(req){
        try{
            let notificationSetting = await NotificationSettings.getNotificationSetting(NotificationSettings.Settings.NEXT_STEP_EMAILS)
            if (notificationSetting){
                console.log("Next Step afterSave was triggered... ");

                if (!req.object.existed() && req.object.get("onboarding")){
                    console.log("New object via 'onboariding'.... not sending email. Exiting")
                    return true;
                }

                var stepQuery = new Parse.Query("NextStep");
                stepQuery.include("deal");
                stepQuery.include("createdBy"); //this fixed the issue where it didn"t know the properties of the author
                stepQuery.include("assignedUser");
                stepQuery.include("modifiedBy");
                let step = await stepQuery.get(req.object.id, {useMasterKey: true});

                var allStepsQuery = new Parse.Query("NextStep");
                allStepsQuery.equalTo("completedDate", null);
                allStepsQuery.equalTo("deal", step.get("deal"));

                let incompleteSteps = await allStepsQuery.find({userMasterKey: true});

                var author = step.get("createdBy");
                var deal = step.get("deal");
                var assignedUser = step.get("assignedUser");
                var modifiedBy = step.get("modifiedBy");

                var status = "Not Done";
                if (step.get("completedDate") != null) {
                    status = "Completed";
                }

                var data = {
                    dealName: deal.get("dealName"),
                    modifiedBy: modifiedBy.toJSON(),
                    stepTitle: step.get("title"),
                    author: author ? author.toJSON() : null,
                    incompleteSteps: incompleteSteps,
                    completedDate: step.get("completedDate"),
                    stepStatus: status,
                    assignedUser: assignedUser ? assignedUser.toJSON() : null,
                    dueDate: step.get("dueDate"),
                    description: step.get("description"),
                    dealLink: envUtil.getHost() + "/roosts/" + deal.id,
                    existed: req.object.existed(),
                    messageId: deal.id
                }
                console.log("sending Next Step after Save Email with data", data);
                // var recipients = EmailUtil.getRecipientsFromStakeholders( stakeholders, author.get("email") );
                let recipients = await EmailUtil.getActualRecipientsForDeal(deal, modifiedBy.get("email"));
                EmailSender.sendTemplate("nextStepNotif", data, recipients);
            }
        }
        catch(e){
            console.error("Something went wrong with sending NextStep email", e);
            Raven.captureException(e)
        }
    });
}
