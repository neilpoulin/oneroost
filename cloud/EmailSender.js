var envUtil = require("./util/envUtil.js");
var ParseCloud = require("parse-cloud-express");
var Parse = ParseCloud.Parse;
var SESEmailSender = require("./email/SESEmailSender");
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

exports.sendEmail = function( message, recipients ){
    Parse.Config.get().then( function(config){
        if ( config.get( "emailEnabled" ) ){
            var actualRecipients = getActualRecipients( recipients, config );
            console.log("actual recipients: ", actualRecipients);
            var email = new SESEmailSender.Mail();
            email.setRecipients( actualRecipients );
            email.subject = message.subject;
            email.text = message.text;
            email.html = message.html;
            SESEmailSender.sendEmail( email );
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
