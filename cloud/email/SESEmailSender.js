var AWS = require("aws-sdk");
var ses = new AWS.SES({region: "us-east-1"});


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
        var template = getTemplate(mail.recipients, mail.subject, mail.html, mail.text);
        console.log("sending mail with SES {}", template);
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
    console.log("exiting from the sendEmail function");
}

function handleSendError( error, response )
{
    console.log("email failed to send", error);
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

function getTemplate(to, subject, html, text){
    if ( !(to instanceof Array ) ){
        to = [to];
    }
    return {
        Destination: { /* required */
            // BccAddresses: [
            //     "STRING_VALUE"
            //     /* more items */
            // ],
            // CcAddresses: [
            //     "STRING_VALUE"
            //     /* more items */
            // ],
            ToAddresses: formatAddresses( to )
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
        Source: "notifications@oneroost.com", /* required */
        ReplyToAddresses: [
            "OneRoost Notifications <notifications@oneroost.com>"
            /* more items */
        ]
        // ReturnPath: "STRING_VALUE",
        // ReturnPathArn: "STRING_VALUE",
        // SourceArn: "STRING_VALUE"
    };
}

exports.Mail = Mail;
