var AWS = require("aws-sdk");
var ses = new AWS.SES({region: "us-east-1"});
var envUtil = require("./../util/envUtil");

var Mail = function(){
    this.recipients = [];
    this.fromName = "OneRoost Notifications";
    this.fromEmail = "notifications@oneroost.com";
    this.subject = "new Notification from OneRoost";
    this.bccAddress = null;
    this.attachments = [];
    this.headers = {};
    this.text = "";
    this.html = "";
    this.messageId = "";
}

Mail.prototype.getFromAddress = function( isDev ){
    var addr = envUtil.isDev() ? "Dev OneRoost" : "OneRoost Notifications";
    addr += " <roost";
    if ( this.messageId )
    {
        addr += "+" + this.messageId;
    }

    addr += "@reply.oneroost.com>";
    return addr;
}

Mail.prototype.setRecipients = function( recipients )
{
    this.recipients = recipients;
    return this;
};

Mail.prototype.addRecipient = function( name, email )
{
    this.recipients.push( {name: name, email: email} );
    return this;
}

Mail.prototype.isValid = function(){
    return this.getErrors.length == 0;
}

Mail.prototype.getErrors = function(){
    var validations = {
        "recipients": this.recipients != null && this.recipients.length > 0,
        "subject": this.subject != null,
        "fromName": this.fromName != null,
        "fromEmail": this.fromEmail != null,
        "content": this.text != null || this.html != null
    };

    var fields = Object.keys(validations);
    return fields.filter( function( field ){
        return !validations[field]
    });
}

exports.sendEmail = function( mail )
{
    if ( !(mail instanceof Mail) ) throw "The email message was not of type Mail";

    if ( !mail.isValid() ) throw JSON.stringify( mail.getErrors() );
    var response = {message: "not set"};
    try {
        var template = getTemplate(mail);
        console.log("sending email temlate: ", template);
        ses.sendEmail( template, function(err, data){
            if (err) { // an error occurred
                return handleSendError( err, response )
            } else {  // successful response
                return handleSendSuccess( data, response );
            }
        } );
    } catch (e) {
        console.log("failed to send", e);
        response.message = "failed to send";
        return response;
    }
}

function handleSendError( error, response )
{
    console.error("email failed to send", error);
    response.error = error;
    response.message = "Failed to send";
    return response;
}

function handleSendSuccess( data, response )
{
    console.log("email sent successfully");
    response.message = "sent successfully!"
    response.data = data;
    return response;
}

function formatAddresses( to ){
    var addresses = [];
    to.forEach( function( addr ){
        addresses.push( addr.name + " <" + addr.email + ">" );
    } )
    return addresses;
}

function getTemplate(mail){
    debugger;
    var to = mail.recipients;
    var subject = mail.subject;
    var html = mail.html;
    var text = mail.text;
    var fromEmail = mail.fromEmail;

    if ( !(to instanceof Array ) ){
        to = [to];
    }
    var source =  mail.getFromAddress();

    return {
        Destination: { /* required */
            BccAddresses:  formatAddresses( to )
            // CcAddresses: [
            //     "STRING_VALUE"
            //     /* more items */
            // ],
            // ToAddresses: formatAddresses( to )
        },
        Message: { /* required */
            Body: { /* required */
                Html: {
                    Data: html /* required */
                },
                Text: {
                    Data: text /* required */
                }
            },
            Subject: { /* required */
                Data: subject /* required */
            }
        },
        Source: "OneRoost <reply@oneroost.com>", /* required */
        ReplyToAddresses: [
            source
            /* more items */
        ]
        // ReturnPath: "STRING_VALUE",
        // ReturnPathArn: "STRING_VALUE",
        // SourceArn: "STRING_VALUE"
    };
}

exports.Mail = Mail;
