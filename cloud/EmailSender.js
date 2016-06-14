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
    return original;
}

exports.sendEmail = function( message, recipients ){
    Parse.Config.get().then( function(config){
        console.log("retrieved config");
        if ( config.get( "emailEnabled" ) ){
            console.log( "the config says email is enabled...preparing to send email." );
            var actualRecipients = getActualRecipients( recipients, config );

            var email = new SESEmailSender.Mail();
            email.setRecipients( actualRecipients );
            email.subject = message.subject;
            email.text = message.text;
            email.html = message.html;

            console.log("email message: " + JSON.stringify( email ) );
            console.log( "sending email to " + JSON.stringify( actualRecipients ) );

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
