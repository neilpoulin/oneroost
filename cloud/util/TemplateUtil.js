var path = require("path");
var templateRoot = path.resolve(__dirname, "..", "email", "template");
var Handlebars = require('handlebars');
var EmailTemplate = require('email-templates').EmailTemplate
var emailTemplates = ["commentNotif", "nextStepNotif"];
var componentTemplates = ["footer"];
var compiledTempaltes = {};
var templates = {};

initializeHandlebars();
initializeEmails();

exports.renderEmail = function(templateName, data){
    debugger;
    if ( emailTemplates.indexOf(templateName) == -1 ){
        throw "You must provide a vaild template";
    }
    return renderTemplate(templateName, data);
}

exports.renderSample = function( name ){
    debugger;
    var template = templates[name];
    return template.render( getSampleData(name) );
}

function renderTemplate( name, data ){
    debugger;
    var template = templates[name];
    return template.render(data);
}

function initializeHandlebars()
{
    var footerBase = "./../email/template/footer/";

    Handlebars.registerPartial('footer-html', require(footerBase + "html.hbs"))
    Handlebars.registerPartial('footer-text', require(footerBase + "text.hbs"))
}

function initializeEmails(){
    emailTemplates.forEach(function(name){
        var templateDir = path.join(templateRoot, name);
        var template = new EmailTemplate(templateDir);
        templates[name] = template;
    });
}

function getSampleData( name ){
    var dataDir = "./../email/template/" + name + "/sample.json";
    var data = require(dataDir);
    return data;
}
