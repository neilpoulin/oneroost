var envUtil = require("./../util/envUtil.js");
var EmailSender = require("./../EmailSender.js");
var EmailUtil = require("./../util/EmailUtil.js");

var ParseCloud = require("parse-cloud-express");
var Parse = ParseCloud.Parse;
Parse.serverURL = envUtil.serverURL;

exports.afterSave = function(){
    Parse.Cloud.afterSave( "Stakeholder", function( req ){
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
                    dealLink: dealLink
                }
                //notify stakeholders of the addition
                var existingRecipients = EmailUtil.getRecipientsFromStakeholders( stakeholders, userEmail );
                EmailSender.sendTemplate( "invitedStakeholderNotif", notifData, existingRecipients, deal.id );

                //invite the new user
                //TODO: check if they are a brand new user
                var inviteData = {
                    invitedByName: invitedByName,
                    invitedByEmail: invitedByEmail,
                    userName: fullName,
                    invitePath: "/invitations/" + req.object.id,
                    dealName: dealName,
                    role: role,
                    dealLink: dealLink
                }

                var inviteEmail = {name: fullName, email: user.get("email")};
                EmailSender.sendTemplate( "roostInvite", inviteData, inviteEmail, deal.id );
            });
        } );
    });
}
