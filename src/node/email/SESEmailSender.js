var AWS = require("aws-sdk");
var ses = new AWS.SES({region: "us-east-1"});
var envUtil = require("./../util/envUtil");
var mailcomposer = require("mailcomposer");
import Raven from "raven"

var Mail = function(){
    this.recipients = [];
    this.fromName = envUtil.getEmailFromName();
    this.fromEmail = "notifications@oneroost.com";
    this.subject = null;
    this.bccAddress = null;
    this.attachments = [];
    this.headers = {};
    this.text = "";
    this.html = "";
    this.messageId = "";
    this.emailRecipientId = null;
    this.unsubscribeLink = null;
    this.unsubscribeEmail = null;
}

Mail.prototype.getFromAddress = function(){
    var addr = envUtil.getEmailFromName();
    addr += " <roost";
    if (this.messageId){
        addr += "+" + this.messageId;
    }
    if (!envUtil.isProd()){
        addr += "@" + envUtil.getEnvName() + ".reply.oneroost.com>";
    }
    else{
        addr += "@reply.oneroost.com>";
    }

    return addr;
}

Mail.prototype.setRecipients = function(recipients){
    this.recipients = recipients;
    return this;
};

Mail.prototype.addRecipient = function(name, email){
    this.recipients.push({name: name, email: email});
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
        "content": this.text != null && this.html != null,
        "emailRecipientId": this.emailRecipientId != null
    };

    var fields = Object.keys(validations);
    return fields.filter(function(field){
        return !validations[field]
    });
}

Mail.prototype.buildRawEmail = function(callback){
    console.log("building raw email...");
    var mail = this;
    var headers = mail.headers;
    // headers.push(mail.getUnsubscribeHeader());
    var fromSender = {
        name: mail.fromName,
        address: mail.fromEmail
    }
    console.log("subject is", mail.subject);
    var opts = {
        from: fromSender,
        sender: fromSender,
        to: formatAddresses(mail.recipients),
        replyTo: mail.getFromAddress(),
        // cc: null,
        // bcc: null,
        // inReplyTo: null,
        // references: null,
        subject: mail.subject,
        text: mail.text,
        html: mail.html,
        // watchHtml: null,
        // icalEvent: null,
        headers: headers,
        attachments: mail.attachments,
        encoding: "base64",
        // envelope: null
    }
    var raw = mailcomposer(opts)
    raw.build(function(err, buffer){
        if (err){
            console.error("Failed to generate email", err);
            Raven.captureException(err)
        }
        else {
            console.log("successfully built email, attempting to send it");
            callback(mail, buffer);
        }
    });
}

exports.sendEmail = function(mail){
    console.log("sending email via SES");
    if (!(mail instanceof Mail)) throw "The email message was not of type Mail";

    if (!mail.isValid()) throw JSON.stringify(mail.getErrors());
    var response = {message: "not set"};
    try {
        console.log("trying to build raw email");
        mail.buildRawEmail(sendRawMail);
    }
    catch (e) {
        console.log("failed to send", e);
        response.message = "failed to send";
        Raven.captureException(e)
        return response;
    }
}

function sendRawMail(mail, buffer){
    console.log("Retrieved raw mail");
    var params = {
        RawMessage: { /* required */
            Data: buffer
        },
        Destinations: formatAddresses(mail.recipients)
        // FromArn: 'STRING_VALUE',
        // ReturnPathArn: 'STRING_VALUE',
        // Source: 'STRING_VALUE',
        // SourceArn: 'STRING_VALUE'
    };
    ses.sendRawEmail(params, function(err, data) {
        if (err){
            console.log(err, err.stack); // an error occurred
            Raven.captureException(err);
        }
        else{
            console.log("successfully sent email to", mail.recipients);           // successful response
        }
    });
}

function formatAddresses(to){
    if (!(to instanceof Array)){
        to = [to];
    }

    var addresses = [];
    to.forEach(function(addr){
        addresses.push((addr.name || addr.email) + " <" + addr.email + ">");
    })
    return addresses;
}

exports.Mail = Mail;
