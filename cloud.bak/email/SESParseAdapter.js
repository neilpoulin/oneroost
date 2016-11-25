var EmailSender = require("./../EmailSender");
var Promise = require("promise");

var SESParseAdapter = sesOptions => {
    var sendMail = mail => {
        var message = {
            subject: mail.subject,
            text: mail.text,
            html: mail.text
        };
        console.log("sending reset email: ", mail);
        return new Promise((resolve, reject) => {
            EmailSender.sendEmail(message, [mail.to]);
            resolve(null);
        });
    }
    return Object.freeze({
        sendMail: sendMail
    });
}

module.exports = SESParseAdapter;