var EmailSender = require("./../EmailSender");
var Promise = require("promise");

var SESEMailAdapter = sesOptions => {
    var sendMail = mail => {
        var message = {
            subject: mail.subject,
            text: mail.text,
            html: mail.text
        };
        return new Promise((resolve, reject) => {
            debugger;
            EmailSender.sendEmail(message, [mail.to]);
            resolve(null);
        });
    }
    return Object.freeze({
        sendMail: sendMail
    });
}

module.exports = SESEMailAdapter;
