var Mandrill = require('mandrill');
var envUtil = require("cloud/util/envUtil.js");
var EmailSender = require("cloud/EmailSender.js")

exports.registerEmailTriggers = function()
{
    doRegister( envUtil.getEnv().mandrillAppId );
}

function doRegister( mandrillAppId )
{
    console.log("registering mandrill with appId = " + mandrillAppId);
    Mandrill.initialize(mandrillAppId);

    Parse.Cloud.afterSave( 'NextStep', function( req, resp ){
        console.log("Next Step afterSave was triggered... ");
        var step = req.object;
        new Parse.Query("Deal").get( step.get("deal").id , {
            success: function( deal ){
                new Parse.Query("User").get( step.get("createdBy").id, {
                    success: function(author){
                        var message = buildNextStepSavedEmail( step, deal );
                        var recipients = getNextStepSavedRecipients( step, author );
                        sendEmail( message, recipients );
                        console.log("Next Step afterSave complete.");
                    },
                    error: function(){
                        console.error("failed to get author.");
                    }
                });
            },
            error: function(){
                console.error( "failed to get the deal" );
            }
        });
    });

    Parse.Cloud.afterSave( 'DealComment', function( req, res ){
        console.log("DealComment afterSave triggered");
        var comment = req.object;
        if ( comment.get("author") != null )
        {
            new Parse.Query("Deal").get( comment.get("deal").id , {
                success: function( deal ){
                    new Parse.Query("User").get( comment.get("author").id, {
                        success: function( author ){
                          var message = buildDealCommentSaveEmail( comment, deal );
                          sendCommentEmail( deal, author, message );
                        },
                        error: function(){
                          console.error( "failed to get author of comment" );

                        }
                    });
                },
                error: function(){
                    console.error("failed to get the deal from the comment.");
                }
            });
        }
        else {
            console.log("not sending deal comment email as the author was null");
        }
    });


    Parse.Cloud.afterSave( 'Stakeholder', function( req, res ){
        console.log( "Stakeholder afterSave triggered" );
        var stakeholderQuery = new Parse.Query("Stakeholder");
        stakeholderQuery.include( "user" );
        stakeholderQuery.include( "invitedBy" );
        stakeholderQuery.include( "deal" );

        stakeholderQuery.get( req.object.id ).then( function( stakeholder ){
            console.log( "found stakeholder object", stakeholder );

            sendEmail( buildStakeholderWelcomeEmail(stakeholder), {
                email: stakeholder.get( "user" ).get("email"),
                name: stakeholder.get( "user" ).get( "username" )
            }, {} );

            var allStakeholderQuery = new Parse.Query( "Stakeholder" );
            allStakeholderQuery.equalTo( "deal", stakeholder.deal );
            allStakeholderQuery.find().then( function (stakeholders){
                sendEmail( buildStakeholderSaveEmail( stakeholder ), getRecipientsFromStakeholders( stakeholders ), {} );
            });


        } );
    });
}

function buildStakeholderWelcomeEmail( stakeholder )
{
    var html = "<h2>Deal Invite</h2>You have been invited to participate in the deal " + stakeholder.get("deal").get("dealName")
    + "<br/>Invited by:  " + stakeholder.get("invitedBy").get("username")
    + "<br/>Click <a href='" + envUtil.getEnv().domain + "www.oneroost.com/deals/" + stakeholder.get("deal").id + "'>here</a> to get started.";

    var text ="Deal Invite \n You have been invited to participate in the deal " + stakeholder.get("deal").get("dealName")
    + "\nInvited by:  " + stakeholder.get("invitedBy").get("username");;
    var subject =  "You have been invited to participate in the deal " + stakeholder.get("deal").get("dealName");

    return {
      html: html,
      text: text,
      subject: subject
    };
}

function getNextStepSavedRecipients( step, author ){
  var recipients = [];

  if ( author.email )
  {
    recipients.push({
      email: author.email,
      name: author.username
    });
  }
  return recipients;
}

function sendCommentEmail( deal, author, message ){
    var recipients = [];
    var authorEmail = author.get("email");
    var stakeholderQuery = new Parse.Query("Stakeholder");
    stakeholderQuery.include( "user" );
    stakeholderQuery.equalTo( "deal", deal );
    stakeholderQuery.find().then( function( stakeholders ){
        console.log( "found stakeholders for the deal" );
        recipients = getRecipientsFromStakeholders( stakeholders, authorEmail );
        sendEmail( message, recipients );
    });
}

function getRecipientsFromStakeholders( stakeholders, excludedEmail )
{
    var recipients = [];
    console.log("processing " + stakeholders.length + " stakeholder emails. Excluding = " + excludedEmail );
    for ( var i = 0; i < stakeholders.length; i++ )
    {
        var stakeholder = stakeholders[i].get("user");
        console.log( "stakeholder is " + JSON.stringify( stakeholder) );
        if ( !excludedEmail || stakeholder.get("email") != excludedEmail )
        {
            var recipient = {email: stakeholder.get("email"), name: stakeholder.get("username")};
            console.log( "adding stakeholder to email... " + JSON.stringify( recipient) );
            recipients.push( recipient );
        }
        else
        {
            console.log( "excluding author from email");
        }
    }
    console.log("retrieved recipients for the list of stakeholders.");
    return recipients;
}

function buildNextStepSavedEmail( step, deal ){
    var status = step.get('completedDate') != null ? 'Done' : 'Not Done';

    var text = deal.get("dealName") + " - Next Step Updated \n " +
              "title: " + step.get("title") + "\n" +
              "description: " + step.get('description');

    var html = "<h2>" + deal.get("dealName") + " - Next Step Updated</h2>" +
              "<br/><b>status</b>:" + status +
              "<br/><b>title</b>: " + step.get("title") +
              "<br/><b>description</b>: " + step.get('description') +
              "<br/><b>due date</b>:" + step.get("dueDate");

    var subject =  deal.get("dealName") + " - Next Step " + step.get("title") + " marked as " + status;

    return {
      html: html,
      text: text,
      subject: subject
    };
}

function buildDealCommentSaveEmail( comment, deal )
{
  var html = "<b>" + comment.get("username") + "</b> said: <br/>" + comment.get("message");
  var text = comment.get("username") + " said: \n" + comment.get("message");
  var subject = deal.get("dealName") +  " - New Comment from " + comment.get("username");

  return {
    html: html,
    text: text,
    subject: subject
  };
}

function buildStakeholderSaveEmail( stakeholder )
{
    var html = "<b>" + stakeholder.get("user").get("email") + " has been added to " + stakeholder.get("deal").get("dealName");
    var text = stakeholder.get("user").get("email") + " has been added to " + stakeholder.get("deal").get("dealName");
    var subject =  stakeholder.get("user").get("email") + "is a new stakeholder on " + stakeholder.get("deal").get("dealName");

    return {
      html: html,
      text: text,
      subject: subject
    };
}

function sendEmail( message, recipients, opts ){
    EmailSender.sendEmail( message, recipients, opts );
}
