var envUtil = require("./util/envUtil.js");
var ParseCloud = require("parse-cloud-express");
var Parse = ParseCloud.Parse;
var TemplateUtil = require("./util/TemplateUtil");
var SESEmailSender = require("./email/SESEmailSender");
var EmailRecipient = Parse.Object.extend("EmailRecipient");
import Raven from "raven"
Parse.serverURL = envUtil.serverURL;


exports.sendTemplate = function( templateName, data, sendTo ){
    console.log("preparing email template: " + templateName)
    data.host = envUtil.getHost();
    var sender = templateSender(templateName, data);
    if (!(sendTo instanceof Array) )
    {
        sendTo = [sendTo];
    }
    console.log("[" + templateName + "] sendTo", sendTo);
    var promises = [];
    sendTo.forEach( function(to){
        try{
            let recipient = findRecipient(to)
            recipient.then(recipient => sender(recipient, to))
            recipient.catch(error => console.log("[" + templateName + "] something went wrong", error))
            promises.push(recipient)
        }
        catch (e){
            console.log("something went wrong creating or fetching the recipient for ", to, e );
            Raven.captureException(e)
        }
    } );
    return Promise.all(promises);
}

function templateSender( templateName, data ){
    console.log("TemplateSender", templateName, data);
    return function(recipient, to){
        try{
            console.log("RecipientSender", recipient, to)
            if ( !recipient.get("unsubscribe") )
            {
                data.unsubscribeLink = getUnsubscribeUrl(recipient.id);
                data.unsubscribeEmail = getUnsubscribeEmail(recipient.id);
                data.recipientId = recipient.id;
                console.log("Rendinering Email for ", templateName);
                return TemplateUtil.renderEmail(templateName, data)
                    .then(function(templateResults){
                        console.log("Rendering complete... attempting to send");
                        sendEmail(templateResults, data, to);
                    }).catch(e => {
                        console.error("[" + templateName + "] Failed to send email ", e)
                        Raven.captureException(e)
                    });
            } else {
                console.log("User has unsubscribed, not sending email", recipient)
            }
        } catch (e){
            console.error("something went wrong sending email", e);
        }
    }
}

async function findRecipient( to )
{
    console.log("finding recipeint for ", to);
    var query = new Parse.Query("EmailRecipient");
    query.equalTo( "email", to.email );
    let emailRecipients = await query.find({useMasterKey: true});

    if ( emailRecipients.length > 0 ){
        var existing = emailRecipients[0];
        console.log("found existing recipient", existing.toJSON())
        if ( !existing.get("unsubscribe") ){
            existing.set("lastSendDate", new Date());
            return existing.save();
        }
        else {
            // console.log("not sending email since the user is unsubscribed", existing.get("email"));
            throw {message: "not sending email since the user is unsubscribed", email: existing.get("email") }
        }
    }
    else { //create new one
        console.log("creating a new recipient for ", to);
        return createEmailRecipient( to )
    }

}


async function createEmailRecipient( to ){
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
            overrides.push({email: overrideEmails[i], name: original.name});
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

exports.sendPlainEmail = async function({subject, text, html, to}){
    console.log("Send Plain Email called");
    const config = await Parse.Config.get();
    var actualRecipients = getActualRecipients(to, config);
    console.log("Actual Recipients:", actualRecipients);
    if ( !actualRecipients ){
        console.log("No actual recpients found, not sending email.");
        return false
    }

    actualRecipients.forEach( function( actualTo ){
        try{
            let recipient = findRecipient(actualTo)
            var email = new SESEmailSender.Mail();
            email.setRecipients( [actualTo] );
            email.subject = subject;
            email.text = text;
            email.html = html;
            // email.messageId = data.messageId;
            email.unsubscribeLink = getUnsubscribeUrl(recipient.id);
            email.unsubscribeEmail = getUnsubscribeEmail(recipient.id);
            email.emailRecipientId = recipient.id;
            email.headers = buildHeaders(email);
            SESEmailSender.sendEmail( email );
            return;
        }
        catch( e ){
            console.log("Something went wrong", e);
            Raven.captureException(e)
            return
        }
    } );
}

function sendEmail( templateResults, data, to ){
    console.log("Template Results", templateResults);
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
