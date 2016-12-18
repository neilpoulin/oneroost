var path = require("path");
var templateRoot = path.resolve(__dirname, "..", "email", "template");
var styleDir = path.resolve(__dirname, "..", "email", "template", "style");
var Handlebars = require("handlebars");
var moment = require("moment");
var EmailTemplate = require("email-templates").EmailTemplate
var emailTemplates = [
    "commentNotif",
    "nextStepNotif",
    "invitedStakeholderNotif",
    "roostInvite",
    "documentAddedNotif",
    "readyRoostSubmittedNotif"
];
var templates = {};

var bootstrapSass = path.resolve(__dirname, "..", "..", "node_modules", "bootstrap-sass", "assets", "stylesheets");
var fontAwesome = path.resolve(__dirname, "..", "..", "node_modules", "font-awesome", "scss");
var materialColors = path.resolve(__dirname, "..", "..", "node_modules", "sass-material-colors", "sass");

initializeHandlebars();
initializeEmails();

exports.getTemplateNames = function(){
    return emailTemplates
}

exports.renderEmail = function(templateName, data){
    if ( emailTemplates.indexOf(templateName) == -1 ){
        throw "You must provide a vaild template";
    }
    return renderTemplate(templateName, data);
}

exports.renderSample = function( name, number ){
    number = number || 0;

    var template = templates[name];
    return template.render( getSampleData(name, number) );
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

    Handlebars.registerHelper("formatCurrency", function(value) {
        return value.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    });
    Handlebars.registerHelper("formatUserName", function(user){
        return user ? user.firstName + " " + user.lastName : "";
    });

    Handlebars.registerHelper("formatDate", function(date){
        if (date != null && date != undefined) {
            return moment(date).format("MMM D, YYYY");
        }
        return null;
    })
    Handlebars.registerHelper("trimText", function(value){
        if (!value){
            return "";
        }
        return value.trim();
    })
}

function initializeEmails(){
    emailTemplates.forEach(function(name){
        var templateDir = path.join(templateRoot, name);
        console.log("creating template", name);
        var template = new EmailTemplate(templateDir, {sassOptions: {
            includePaths: [bootstrapSass, fontAwesome, materialColors, styleDir]
        }});
        templates[name] = template;
    });
}

function getSampleData( name, number ){
    var dataDir = "./../email/template/" + name + "/sample.json";
    var data = require(dataDir);
    if ( data.constructor === Array ){
        data = data[number];
    }
    return data;
}
