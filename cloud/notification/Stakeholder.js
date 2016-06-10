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
            var allStakeholderQuery = new Parse.Query( "Stakeholder" );
            allStakeholderQuery.equalTo( "deal", deal );
            allStakeholderQuery.find().then( function (stakeholders){
                var dealLink = envUtil.getHost() + "/deals/" + deal.id;
                var message = {
                    subject: fullName + " is a new stakeholder on " + deal.get("dealName"),
                    text: fullName + " is a new stakeholder on " + deal.get("dealName") + "\n\nLink: " + dealLink,
                    html: fullName + " is a new stakeholder on " + deal.get("dealName") + "<br/><a href='" + dealLink + "'>" + dealLink + "</a>"
                };
                //notify stakeholders of the addition
                EmailSender.sendEmail( message, EmailUtil.getRecipientsFromStakeholders( stakeholders ) );

                //invite the new username
                //TODO: check if they are a brand new user
                var invitedByText = fullName + " (" + invitedBy.get("email") + ")";
                message = {
                    subject: "You have been invited to participate in the deal " + deal.get("dealName"),
                    text: "You have been invited to participate in the deal " + deal.get("dealName") + " as a " + role + " by " + invitedByText + "\n\nLink: " + dealLink,
                    html: "You have been invited to participate in the deal " + deal.get("dealName") + " as a " + role + " by " + invitedByText + "<br/><a href='" + dealLink + "'>" + dealLink + "</a>"
                }

                EmailSender.sendEmail( message, {name: fullName, email: user.get("email")} );

            });
        } );
    });
}
