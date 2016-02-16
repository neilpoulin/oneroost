var envUtil = require("cloud/util/envUtil.js");
var EmailSender = require("cloud/EmailSender.js");
var Template = require("cloud/email/MandrillEmailTemplate.js").Template;
var EmailUtil = require("cloud/util/EmailUtil.js");


exports.afterSave = function(){
    Parse.Cloud.afterSave( 'Stakeholder', function( req, res ){
        console.log( "Stakeholder afterSave triggered" );
        var stakeholderQuery = new Parse.Query("Stakeholder");
        stakeholderQuery.include( "user" );
        stakeholderQuery.include( "invitedBy" );
        stakeholderQuery.include( "deal" );

        stakeholderQuery.get( req.object.id ).then( function( stakeholder ){
            console.log( "found stakeholder object", stakeholder );

            var deal = stakeholder.get( "deal" );
            var invitedBy = stakeholder.get("invitedBy");
            var role = stakeholder.get("role");
            var user = stakeholder.get("user");
            var dealUrl = "http://" + envUtil.getEnv().domain + "/deals/" + deal.id;

            var allStakeholderQuery = new Parse.Query( "Stakeholder" );
            allStakeholderQuery.equalTo( "deal", deal );
            allStakeholderQuery.find().then( function (stakeholders){

                //notify stakeholders of the addition
                var stakeholderAddedTemplate = new Template("stakeholder-added");
                stakeholderAddedTemplate.setRecipients( EmailUtil.getRecipientsFromStakeholders( stakeholders ) )
                    .putGlobalVar( "invitedBy", invitedBy )
                    .putGlobalVar( "user", user.toJSON() )
                    .putGlobalVar( "role", role )
                    .putGlobalVar( "dealUrl", dealUrl )
                    .setSubject( user.get("email") + "is a new stakeholder on " + deal.get("dealName") );

                EmailSender.sendMandrillTemplate( stakeholderAddedTemplate );

                //invite the new username
                //TODO: check if they are a brand new user
                var welcomeTemplate = new Template("stakeholder-invite");
                welcomeTemplate.setRecipients( EmailUtil.getRecipientsFromStakeholders( stakeholders ) )
                    .putGlobalVar( "user", user.toJSON() )
                    .putGlobalVar( "role", role )
                    .putGlobalVar( "invitedBy", invitedBy.toJSON() )
                    .putGlobalVar( "dealUrl", dealUrl )
                    .setSubject( "You have been invited to participate in the deal " + deal.get("dealName") );

                EmailSender.sendMandrillTemplate( welcomeTemplate );

            });
        } );
    });
}
