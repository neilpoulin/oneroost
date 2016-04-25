var mandrill = require('mandrill-api/mandrill');

var envUtil = require("./util/envUtil.js");
var MandrillEmailTemplate = require("./email/MandrillEmailTemplate.js");
var env = envUtil.getEnv();
console.log("registering mandrill with appId = " + envUtil.getEnv().mandrillAppId );

var Mandrill = new mandrill.Mandrill(envUtil.getEnv().mandrillAppId);

var ParseCloud = require('parse-cloud-express');
var Parse = ParseCloud.Parse;
Parse.serverURL = envUtil.serverURL;

function getActualRecipients( original, config )
{
    var emailOverride = config.get( "emailOverride");
    if ( emailOverride )
    {
        var overrides = [];
        var overrideEmails = emailOverride.replace(/ /g, "").split(",");
        for ( var i = 0; i < overrideEmails.length; i++ )
        {
            overrides.push({email: overrideEmails[i], name: overrideEmails[i]});
        }
        return overrides;
    }
    return original;
}

exports.sendMandrillTemplate = function( template )
{
    console.log( "sending mandrill template" );

    Parse.Config.get().then( function(config){
        if ( config.get( "emailEnabled" ) ){
            console.log( "the config says email is enabled...preparing to send template " + template.templateName );
            template.putGlobalVar("originalRecipients", template.recipients )
                .setRecipients( getActualRecipients( template.recipients, config ) )
                .setFromName( "OneRoost " + ( env.envName == "prod" ? "" : env.envName ) );

            sendTemplateRequest( template );
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

function sendTemplateRequest( template )
{
    Parse.Cloud.httpRequest({
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        url: 'https://mandrillapp.com/api/1.0/messages/send-template.json',
        body: template.get(),
        success: function(){
            console.log("Email template sent succesfully");
        },
        error: function(error){
            console.log("Email template failed to send: " + error.text);
        }
    });
}

exports.sendEmail = function( message, recipients, opts ){
    Parse.Config.get().then( function(config){
        console.log("retrieved config");
        if ( config.get( "emailEnabled" ) ){
            console.log( "the config says email is enabled...preparing to send email." );
            var options = opts || {};
            var env = envUtil.getEnv();
            var actualRecipients = getActualRecipients( recipients, config );

            message.to = actualRecipients;
            message.from_email = "info@oneroost.com";
            message.from_name = "OneRoost " + ( env.envName == "prod" ? "" : env.envName );

            console.log("email message: " + JSON.stringify( message ) );
            console.log( "sending email to " + JSON.stringify( actualRecipients ) );
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
        else {
            console.log("the config does not allow sending email, not sending email");
        }
    },
    function(error){
        console.log("error... failed to get config");
        console.log(error);
    });
}
