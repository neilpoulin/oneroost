var EmailSender = require("./../EmailSender");
var Promise = require("promise");

var SESParseAdapter = sesOptions => {
    console.log("parse email adapter for SES");
    return Object.freeze({
        sendMail: (mail) => {
            var message = {
                subject: mail.subject,
                text: mail.text,
                html: mail.text,
                to: [mail.to]
            };
            console.log("sending parse generated email: ", mail);
            return new Promise((resolve, reject) => {
                console.log("Email sender about to be invoked")
                EmailSender.sendPlainEmail(message);
                resolve(null);
            });
        }
    });
}

module.exports = SESParseAdapter;
