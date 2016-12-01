var envUtil = require("./util/envUtil.js");
var ParseCloud = require("parse-cloud-express");
var Parse = ParseCloud.Parse;
var TemplateUtil = require("./util/TemplateUtil");
var SESEmailSender = require("./email/SESEmailSender");
var EmailRecipient = Parse.Object.extend("EmailRecipient");
Parse.serverURL = envUtil.serverURL;


exports.sendTemplate = function( templateName, data, sendTo ){
    console.log("preparing email template: " + templateName)
    data.host = envUtil.getHost();
    var sender = templateSender(templateName, data);
    if (!(sendTo instanceof Array) )
    {
        sendTo = [sendTo];
    }
    var recipients = [];
    console.log("sendTo", sendTo);
    sendTo.forEach( function(to){
        let recipient = findRecipient(to)
        recipients.push(recipient);
        recipient.then(recipient => sender(recipient, to))
        recipient.catch(error => console.log("something went wrong", error))
    } );
}

function templateSender( templateName, data ){
    console.log("TemplateSender", templateName, data);
    return function(recipient, to){
        console.log("RecipientSender", recipient, to)
        if ( !recipient.get("unsubscribe") )
        {
            data.unsubscribeLink = getUnsubscribeUrl(recipient.id);
            data.unsubscribeEmail = getUnsubscribeEmail(recipient.id);
            data.recipientId = recipient.id;
            TemplateUtil.renderEmail(templateName, data)
            .then(function(templateResults){
                sendEmail(templateResults, data, to);
            });
        } else {
            console.log("User has unsubscribed, not sending email", recipient)
        }
    }
}

function findRecipient( to )
{
    console.log("finding recipeint for ", to);
    var query = new Parse.Query("EmailRecipient");
    query.equalTo( "email", to.email );
    return query.find().then( function(emailRecipients){
        return new Promise(function(resolve, reject){
            if ( emailRecipients.length > 0 ){
                var existing = emailRecipients[0];
                if ( !existing.get("unsubscribe") ){
                    existing.set("lastSendDate", new Date());
                    existing.save();
                    resolve(existing)
                }
                else {
                    // console.log("not sending email since the user is unsubscribed", existing.get("email"));
                    reject( {message: "not sending email since the user is unsubscribed", email: existing.get("email") });
                }
            }
            else { //create new one
                return createEmailRecipient( to );
            }
        })
    });
}


function createEmailRecipient( to ){
    var recipient = new EmailRecipient();
    recipient.set("email", to.email);
    recipient.set("unsubscribe", false);
    recipient.set("lastSendDate", new Date());
    recipient.set("unsubscribeDate", null);
    console.log("saving new email recipient: ", to);
    return recipient.save();
}

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

function getUnsubscribeUrl( recipientId ){
    var path = "/unsubscribe/" + recipientId;
    var url = envUtil.getHost() + path;
    return url;
}

function getUnsubscribeEmail( recipientId ){
    var domain = "reply.oneroost.com";
    if (envUtil.isDev()){
        domain = "dev." + domain;
    }
    else if ( envUtil.isStage()){
        domain = "stage." + domain;
    }
    var address = "unsubscribe+" + recipientId + "@" + domain;
    return address;
}

function sendEmail( templateResults, data, to ){
    Parse.Config.get().then( function(config){
        if ( config.get( "emailEnabled" ) ){

            var actualRecipients = getActualRecipients( to, config );
            console.log("actual recipients: ", actualRecipients);
            if ( !actualRecipients ){
                console.log("No actual recpients found, not sending email.");
                return false
            }

            actualRecipients.forEach( function( actualTo ){
                var email = new SESEmailSender.Mail();
                email.setRecipients( [actualTo] );
                email.subject = templateResults.subject;
                email.text = templateResults.text;
                email.html = templateResults.html;
                email.messageId = data.messageId;
                email.unsubscribeLink = data.unsubscribeLink;
                email.unsubscribeEmail = data.unsubscribeEmail;
                email.emailRecipientId = data.recipientId;
                email.headers = buildHeaders(data);
                email.attachments = data.attachments || [];
                SESEmailSender.sendEmail( email );
            } );
        }
        else {
            console.log("the config does not allow sending email, not sending email");
        }
    },
    function(error){
        console.log("error... failed to get config when sending an email");
        console.log(error);
    });
}

function buildHeaders( data ){
    var headers = [];

    headers.push( getUnsubscribeHeader(data) ) ;
    return headers.filter( function (header){
        return header != null;
    });
}

function getUnsubscribeHeader(data){

    var values = [];
    if ( data.unsubscribeLink != null )
    {
        values.push( "<" + data.unsubscribeLink + ">" );
    }
    if ( data.unsubscribeEmail != null ){
        values.push("<mailto:" + data.unsubscribeEmail + ">")
    }
    if ( values ){
        return {
            key: "List-Unsubscribe",
            value: values.join(", ")
        }
    }
    return null;
}
