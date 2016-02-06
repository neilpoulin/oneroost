var Mandrill = require('mandrill');
var envUtil = require("cloud/util/envUtil.js");

console.log("registering mandrill with appId = " + mandrillAppId);
Mandrill.initialize(envUtil.getEnv().mandrillAppId);

exports.sendEmail = function( message, recipients, opts ){
    Parse.Config.get().then( function(config){
          console.log("retrieved config");
          if ( config.get( "emailEnabled" ) ){
              console.log( "the config says email is enabled...preparing to send email." );
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
          else {
              console.log("the config does not allow sending email, not sending email");
          }
      },
      function(error){
          console.log("error... failed to get config");
          console.log(error);
      });
}
