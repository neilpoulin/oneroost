var EmailSender = require("./../EmailSender");
var Promise = require("promise");
import {VERIFY_EMAIL_TEMPLATE, PASSWORD_RESET_TEMPALTE} from "./TemplateConstants"

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
        },
        sendVerificationEmail: ({ link, appName, user }) => {
            console.log("sending email verication email");
            const data = {link, appName, user: user.toJSON()};
            return new Promise((resolve, reject) => {
                EmailSender.sendTemplate(VERIFY_EMAIL_TEMPLATE, data, user.get("email"))
                resolve(null);
            })
        },
        sendPasswordResetEmail: ({ link, appName, user }) => {
            console.log("sending password reset email");
            const data = {link, appName, user: user.toJSON()};
            return new Promise((resolve, reject) => {
                EmailSender.sendTemplate(PASSWORD_RESET_TEMPALTE, data, user.get("email"))
                resolve(null);
            })
        },
    });
}

module.exports = SESParseAdapter;
