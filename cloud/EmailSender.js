var envUtil = require("./util/envUtil.js");
var ParseCloud = require("parse-cloud-express");
var Parse = ParseCloud.Parse;
var TemplateUtil = require("./util/TemplateUtil");
var SESEmailSender = require("./email/SESEmailSender");
var EmailRecipient = Parse.Object.extend("EmailRecipient");
Parse.serverURL = envUtil.serverURL;

function getActualRecipients( original, config )
{
    if ( config.get("emailOverrideEnabled") )
    {
        var emailOverride = config.get( "emailOverride");
        console.log("email override is on - original recipients: ", original );
        var overrides = [];
        var overrideEmails = emailOverride.replace(/ /g, "").split(",");
        for ( var i = 0; i < overrideEmails.length; i++ )
        {
            overrides.push({email: overrideEmails[i], name: overrideEmails[i]});
        }
        return overrides;
    }
    else {
        console.log("emailOverride is disabled");
    }
    var processedEmails = [];
    if ( original instanceof Array )
    {
        for ( var j=0; j<original.length; j++)
        {
            var entry = original[j];
            processedEmails.push(processEmailInput(entry));
        }
    }
    else {
        processedEmails.push(processEmailInput(original));
    }
    return processedEmails;
}

function processEmailInput( original )
{
    var result = null;
    if ( typeof original == "string"){
        result ={email: original, name: original};
    }
    else if ( original instanceof Object )
    {
        if ( !original["email"] )
        {
            throw "You must provide an email in your recipients";
        }
        if ( !original["name"] )
        {
            original["name"] = original.email;
        }
        result = original;
    }
    return result;
}


function createEmailRecipientAndSend( emailObject, email ){
    var recipient = new EmailRecipient();
    recipient.set("email", emailObject.email);
    recipient.set("unsubscribe", false);
    recipient.set("lastSendDate", new Date());
    recipient.set("unsubscribeDate", null);
    recipient.save().then(function(saved){
        console.log("successfully saved new email recipient", saved);
        email.emailRecipientId = saved.id;
        addFooterAndSend(email);
    });
}

function sendIfValid( email )
{
    email.recipients.forEach( function( recipient ) {
        var query = new Parse.Query("EmailRecipient");
        query.equalTo( "email", recipient.email );
        query.find().then( function(emailRecipients){
            if ( emailRecipients.length > 0 ){
                var existing = emailRecipients[0];
                if ( !existing.get("unsubscribe") ){
                    existing.set("lastSendDate", new Date());
                    existing.save();
                    email.emailRecipientId = existing.id;
                    addFooterAndSend(email);
                }
                else {
                    console.log("not sending email since the user is unsubscribed", existing);
                }
            }
            else { //create new one
                createEmailRecipientAndSend( recipient, email );
            }
        });
    });
}


function getUnsubscribeUrl( mail ){
    var id = mail.emailRecipientId;
    var path = "/unsubscribe/" + id;
    var url = envUtil.getHost() + path;
    return url;
}

function appendUnsubscribe( mail ){
    var url = getUnsubscribeUrl(mail);

    var footer = TemplateUtil.renderComponent( "standardFooter", {unsubscribeLink: url} );

    mail.html += footer.html;
    mail.text += footer.text;
}

function addFooterAndSend(email)
{
    console.warn("Not appending a footer right now...should be taken care of by templates.");
    // appendUnsubscribe(email);
    SESEmailSender.sendEmail( email );

}

exports.sendTemplate = function( template, data, recipients, messageId ){
    TempalteUtil.renderEmail(template, data).then(function(results){
        console.log("Processing results of the templates", results);
        this.sendEmail(results, recipients, messageId);
    });
}

exports.sendEmail = function( message, recipients, messageId ){
    Parse.Config.get().then( function(config){
        if ( config.get( "emailEnabled" ) ){
            var actualRecipients = getActualRecipients( recipients, config );
            console.log("actual recipients: ", actualRecipients);
            actualRecipients.forEach( function( to ){
                var email = new SESEmailSender.Mail();
                email.setRecipients( [to] );
                email.subject = message.subject;
                email.text = message.text;
                email.html = message.html;
                email.messageId = messageId;
                sendIfValid( email );
            } );
        }
        else {
            console.log("the config does not allow sending email, not sending email");
        }
    },
    function(error){
        console.log("error... failed to get config");
        console.log(error);
    });
}
