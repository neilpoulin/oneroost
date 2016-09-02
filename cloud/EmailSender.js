var envUtil = require("./util/envUtil.js");
var ParseCloud = require("parse-cloud-express");
var Parse = ParseCloud.Parse;
var TemplateUtil = require("./util/TemplateUtil");
var SESEmailSender = require("./email/SESEmailSender");
var EmailRecipient = Parse.Object.extend("EmailRecipient");
Parse.serverURL = envUtil.serverURL;


exports.sendTemplate = function( templateName, data, sendTo ){
    data.host = envUtil.getHost();
    var sender = templateSender(templateName, data);
    sendTo.forEach( function(to){
        findRecipient(to, sender, function(error){
            console.log("something went wrong", error);
        });
    } );
}

function templateSender( templateName, data ){
    return function(recipient, to){
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


function findRecipient( to, callback, errorCallack )
{
    var query = new Parse.Query("EmailRecipient");
    query.equalTo( "email", to.email );
    query.find().then( function(emailRecipients){
        if ( emailRecipients.length > 0 ){
            var existing = emailRecipients[0];
            if ( !existing.get("unsubscribe") ){
                existing.set("lastSendDate", new Date());
                existing.save();
                callback(existing, to)
            }
            else {
                // console.log("not sending email since the user is unsubscribed", existing.get("email"));
                errorCallack( "not sending email since the user is unsubscribed", existing.get("email") );
            }
        }
        else { //create new one
            createEmailRecipient( to, callback );
        }
    });
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

function createEmailRecipient( to, callback ){
    var recipient = new EmailRecipient();
    recipient.set("email", to.email);
    recipient.set("unsubscribe", false);
    recipient.set("lastSendDate", new Date());
    recipient.set("unsubscribeDate", null);
    recipient.save().then(function(savedRecipient){
        console.log("successfully saved new email recipient", savedRecipient);
        callback(savedRecipient, to)
    });
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
        console.log("error... failed to get config");
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
