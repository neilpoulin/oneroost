var Mandrill = require('mandrill');
var envUtil = require("cloud/util/envUtil.js");


exports.registerEmailTriggers = function()
{
  console.log("registering email triggers");

  Mandrill.initialize('dmCF3Rb55CIbJVvnzB4uzw');


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
              var recipients = getCommentAddedRecipients( deal, author)
              sendEmail( message, recipients );
              console.log("Sending email");
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
    console.log("DealComment afterSave complete.");
  });

}

function getNextStepSavedRecipients( step, author ){
  var recipients = [{
    email: "neil.j.poulin@gmail.com",
    name: "Neil Poulin"
  }];

  if ( author.email )
  {
    recipients.push({
      email: author.email,
      name: author.username
    });
  }
  return recipients;
}

function getCommentAddedRecipients( deal, author ){
  var recipients = [{
    email: "neil.j.poulin@gmail.com",
    name: "Neil Poulin"
  }];

  var stakeholders = deal.get( "stakeholders" ) || [];
  for ( var i = 0; i < stakeholders.length; i++ )
  {
    var stakeholder = stakeholders[i];
    if ( stakeholder.email != author.get("email ") )
    {
      console.log( "adding stakeholder to email... " + JSON.stringify( stakeholder) );
    }
    else
    {
        console.log( "excluding author from email");
    }
  }

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

function sendEmail( message, recipients, opts ){
    var options = opts || {};
    var env = envUtil.getEnv();
    message.from_email = "info@oneroost.com";
    message.from_name = "OneRoost " + ( env.envName == "prod" ? "" : env.envName );
    message.to = recipients;
    console.log("email message: " + JSON.stringify( message ) );
    console.log( "sending email to " + JSON.stringify( recipients ) );
    Mandrill.sendEmail({
        message: message,
        async: options.async || true
    },
    {
      success: function( response ){
          console.log( "Email sent successfully: " + message.subject );
      },
      error: function ( response ){
          console.error( "FAILED TO SEND EMAIL: " + message.subject + " | to: " + JSON.stringify(recipients) );
          console.error( response );
      }
    });
}
