var envUtil = require("./../util/envUtil.js");
var EmailSender = require("./../EmailSender.js");
var EmailUtil = require("./../util/EmailUtil.js");

var ParseCloud = require("parse-cloud-express");
var Parse = ParseCloud.Parse;
Parse.serverURL = envUtil.serverURL;

exports.afterSave = function(){
    Parse.Cloud.afterSave( "Stakeholder", async function(req, res){
        try{
            console.log("Stakeholder afterSave triggered");
            var stakeholderQuery = new Parse.Query("Stakeholder");
            stakeholderQuery.include("user");
            stakeholderQuery.include("invitedBy");
            stakeholderQuery.include("deal");
            let stakeholder = await stakeholderQuery.get(req.object.id);
            var deal = stakeholder.get("deal");
            var invitedBy = stakeholder.get("invitedBy");
            var role = stakeholder.get("role");
            var user = stakeholder.get("user");
            var userEmail = user.get("email");
            var dealName = deal.get("dealName");
            var dealLink = envUtil.getHost() + "/roosts/" + deal.id;
            console.log("checking if is new invite");
            let isNewInvite = stakeholder.get("updatedAt").getTime() === stakeholder.get("createdAt").getTime();
            isNewInvite = stakeholder.existed();
            if ( !isNewInvite ){
                console.log("the invite was updated, not created... exiting");
                return res.success();
            }
            console.log("this is a new invite, setting up emails");

            var notifData = {
                user: user.toJSON(),
                invitedBy: invitedBy.toJSON(),
                dealName: dealName,
                role: role,
                dealLink: dealLink,
                messageId: deal.id
            }
            //notify stakeholders of the addition
            console.log("setting up invite email for existing stakeholders...");
            let existingRecipients = await EmailUtil.getActualRecipientsForDeal(deal, userEmail)
            EmailSender.sendTemplate( "invitedStakeholderNotif", notifData, existingRecipients );
            console.log("sent email for existing stakeholders");
            console.log("setting up email for new invitee");

            if ( stakeholder.get("readyRoostApprover") ){
                console.log("this person is a ready roost approver, not sending an invite email");
            }
            else if ( user.id === invitedBy.id ){
                console.log("This stakeholder is the same as the person that invited them, not sending an email.");
            }
            else {
                //invite the new user
                var inviteData = {
                    invitedBy: invitedBy.toJSON(),
                    user: user.toJSON(),
                    dealName: dealName,
                    role: role,
                    dealLink: dealLink,
                    messageId: deal.id,
                    inviteLink: envUtil.getHost() + "/invitations/" + req.object.id
                }
                var fullName = user.get("firstName") + " " + user.get("lastName");
                var inviteEmail = {name: fullName, email: userEmail};
                console.log("sending invite email to ", inviteEmail);
                EmailSender.sendTemplate( "roostInvite", inviteData, inviteEmail );
                console.log("send email for new invitee");
            }
        }
        catch (e){
            console.error("Failed to save stakeholder", e);
        }
    });
}
