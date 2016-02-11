var Mandrill = require('mandrill');
var envUtil = require("cloud/util/envUtil.js");

console.log("registering mandrill with appId = " + envUtil.getEnv().mandrillAppId );
Mandrill.initialize(envUtil.getEnv().mandrillAppId);

exports.sendEmail = function( message, recipients, opts ){
    Parse.Config.get().then( function(config){
        console.log("retrieved config");
        if ( config.get( "emailEnabled" ) ){
            console.log( "the config says email is enabled...preparing to send email." );
              var options = opts || {};
              var env = envUtil.getEnv();
              var actualRecipients = recipients;
              var emailOverride = config.get( "emailOverride");
              if ( emailOverride )
              {
                  var overrides = [];
                  var overrideEmails = emailOverride.replace(/ /g, "").split(",");
                  for ( var i = 0; i < overrideEmails.length; i++ )
                  {
                      overrides.push({email: overrideEmails[i], name: overrideEmails[i]});
                  }
                  actualRecipients = overrides;
                  message.html += "<br/><hr/>Email Override is On. Original recipients were: " + JSON.stringify( recipients );
                  message.text += "\n\nEmail Override is On. Original recipients were: " + JSON.stringify( recipients );
              }
              message.from_email = "info@oneroost.com";
              message.from_name = "OneRoost " + ( env.envName == "prod" ? "" : env.envName );
              message.to = actualRecipients;

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
