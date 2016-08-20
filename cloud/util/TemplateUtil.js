var handlebars = require("handlebars");
var fs = require("fs");
var path = require("path");
var templateRoot = path.resolve(__dirname, "..", "email", "template");
var EmailTemplate = require('email-templates').EmailTemplate
var emailTemplates = ["commentNotif", "nextStepNotif"];
var componentTemplates = ["footer"];
var compiledTempaltes = {};
var templates = {};

initializeEmails();

exports.renderEmail = function(templateName, data){
    debugger;
    if ( emailTemplates.indexOf(templateName) == -1 ){
        throw "You must provide a vaild template";
    }
    return renderTemplate(templateName, data);
}

function renderTemplate( name, data ){
    debugger;
    var template = templates[name];
    return template.render(data);
}

function initializeEmails(){
    emailTemplates.forEach(function(name){
        var templateDir = path.join(templateRoot, name);
        var template = new EmailTemplate(templateDir);
        templates[name] = template;
    });
}
