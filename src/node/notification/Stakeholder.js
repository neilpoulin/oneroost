var envUtil = require("./../util/envUtil.js");
var EmailSender = require("./../EmailSender.js");
var EmailUtil = require("./../util/EmailUtil.js");

var ParseCloud = require("parse-cloud-express");
var Parse = ParseCloud.Parse;
Parse.serverURL = envUtil.serverURL;

exports.afterSave = function(){
    Parse.Cloud.afterSave( "Stakeholder", function( req, res){
        console.log( "Stakeholder afterSave triggered" );
        var stakeholderQuery = new Parse.Query("Stakeholder");
        stakeholderQuery.include( "user" );
        stakeholderQuery.include( "invitedBy" );
        stakeholderQuery.include( "deal" );

        stakeholderQuery.get( req.object.id ).then( function( stakeholder ){
            var deal = stakeholder.get( "deal" );
            var invitedBy = stakeholder.get("invitedBy");
            var role = stakeholder.get("role");
            var user = stakeholder.get("user");
            var fullName = user.get("firstName") + " " + user.get("lastName");
            var invitedByName = invitedBy.get("firstName") + " " + invitedBy.get("lastName");
            var invitedByEmail = invitedBy.get("email");
            var userEmail = user.get("email");
            var dealName = deal.get("dealName");
            var allStakeholderQuery = new Parse.Query( "Stakeholder" );
            allStakeholderQuery.equalTo( "deal", deal );
            allStakeholderQuery.include("user");
            allStakeholderQuery.find().then( function (stakeholders){
                var dealLink = envUtil.getHost() + "/roosts/" + deal.id;
                var notifData = {
                    userName: fullName,
                    userEmail: userEmail,
                    invitedByName: invitedByName,
                    invitedByEmail: invitedByEmail,
                    dealName: dealName,
                    role: role,
                    dealLink: dealLink,
                    messageId: deal.id
                }
                //notify stakeholders of the addition
                console.log("setting up invite email for existing stakeholders...");
                var existingRecipients = EmailUtil.getRecipientsFromStakeholders( stakeholders, [userEmail, invitedByEmail] );
                EmailSender.sendTemplate( "invitedStakeholderNotif", notifData, existingRecipients );
                console.log("sent email for existing stakeholders");
                console.log("setting up email for new invitee");


                if ( stakeholder.get("readyRoostApprover") ){
                    console.log("this person is a ready roost approver, not sending an invite email");
                } else {
                    //invite the new user
                    var inviteData = {
                        invitedByName: invitedByName,
                        invitedByEmail: invitedByEmail,
                        userName: fullName,
                        dealName: dealName,
                        role: role,
                        dealLink: dealLink,
                        messageId: deal.id,
                        inviteLink: envUtil.getHost() + "/invitations/" + req.object.id
                    }
                    var inviteEmail = {name: fullName, email: user.get("email")};
                    console.log("sending invite email to ", inviteEmail);
                    EmailSender.sendTemplate( "roostInvite", inviteData, inviteEmail );
                    console.log("send email for new invitee");
                }
            });
        } );
    });
}