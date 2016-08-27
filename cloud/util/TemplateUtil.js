var path = require("path");
var templateRoot = path.resolve(__dirname, "..", "email", "template");
var styleDir = path.resolve(__dirname, "..", "email", "template", "style");
var Handlebars = require("handlebars");
var EmailTemplate = require("email-templates").EmailTemplate
var emailTemplates = ["commentNotif", "nextStepNotif", "invitedStakeholderNotif", "roostInvite"];
var templates = {};

var bootstrapSass = path.resolve(__dirname, "..", "..", "node_modules", "bootstrap-sass", "assets", "stylesheets");

initializeHandlebars();
initializeEmails();

exports.renderEmail = function(templateName, data){
    if ( emailTemplates.indexOf(templateName) == -1 ){
        throw "You must provide a vaild template";
    }
    return renderTemplate(templateName, data);
}

exports.renderSample = function( name ){
    var template = templates[name];
    return template.render( getSampleData(name) );
}

function renderTemplate( name, data ){
    var template = templates[name];
    return template.render(data);
}

function initializeHandlebars()
{
    var partialsBase = "./../email/template/_partials/"
    var footerBase = partialsBase + "footer/";
    Handlebars.registerPartial("footer-html", require(footerBase + "html.hbs"));
    Handlebars.registerPartial("footer-text", require(footerBase + "text.hbs"));

    var roostLinkBase = partialsBase + "roostLink/"
    Handlebars.registerPartial("roost-link-html", require(roostLinkBase + "html.hbs"));
    Handlebars.registerPartial("roost-link-text", require(roostLinkBase + "text.hbs"));
}

function initializeEmails(){
    emailTemplates.forEach(function(name){
        var templateDir = path.join(templateRoot, name);
        console.log("creating template", name);
        var template = new EmailTemplate(templateDir, {sassOptions: {
            includePaths: [bootstrapSass, styleDir]
        }});
        templates[name] = template;
    });
}

function getSampleData( name ){
    var dataDir = "./../email/template/" + name + "/sample.json";
    var data = require(dataDir);
    return data;
}
