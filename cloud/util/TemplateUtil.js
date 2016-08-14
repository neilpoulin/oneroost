var handlebars = require("handlebars");
var fs = require("fs");
var path = require("path");
var templateRoot = path.resolve(__dirname, "..", "email", "template");
var EmailTemplate = require('email-templates').EmailTemplate
var emailTemplates = ["commentNotif"];
var componentTemplates = ["footer"];
var compiledTempaltes = {};
var templates = {};

// initializeTempaltes();
initializeEmails();

exports.renderEmail = function(templateName, data){
    debugger;
    if ( emailTemplates.indexOf(templateName) == -1 ){
        throw "You must provide a vaild template";
    }
    return renderTemplate(templateName, data);
}

exports.renderComponent = function(templateName, data){
    debugger;
    if ( componentTemplates.indexOf(templateName) == -1 ){
        throw "You must provide a valid footer template name";
    }
    return renderTemplate(templateName, data);
}

function renderTemplate( name, data ){
    debugger;
    var template = templates[name];
    return template.render(data);


    // var result = {
    //     "html": compiledTempaltes[name + "-html"](data),
    //     "text": compiledTempaltes[name + "-text"](data),
    // }
    // console.log(result);
    // return result
}

function renderEmail( name, data ){
    var result = {
        "html": compiledTempaltes[name + "-html"](data),
        "text": compiledTempaltes[name + "-text"](data),
        "subject" : compiledTempaltes[name + "-subject"](data)
    }
    console.log(result);
    return result
}

function initializeEmails(){
    emailTemplates.forEach(function(name){
        var templateDir = path.join(templateRoot, "email", name);
        var template = new EmailTemplate(templateDir);
        templates[name] = template;
    });
}
//
// function initializeTempaltes(){
//     Object.keys(emailTemplates).forEach( function(name){
//         var path = emailTemplates[name];
//         console.log("setting up email templates: " + path);
//         initializeCompiledTemplate(name, "email/" + path, "text");
//         initializeCompiledTemplate(name, "email/" + path, "html");
//         initializeCompiledTemplate(name, "email/" + path, "subject");
//     } );
//
//     Object.keys(componentTemplates).forEach(function(name){
//         var path = componentTemplates[name];
//         initializeCompiledTemplate(name, "component/" + path, "text" );
//         initializeCompiledTemplate(name, "component/" + path, "html" );
//     });
// }
//
// function initializeCompiledTemplate( name, path, type ){
//     fs.readFile(templateRoot + "/" + path + "-" + type + ".hbs", function(err, data){
//         console.log("setting up templates: " + name + ", " + path +", "+ type );
//         if ( !err ){
//             var source = data.toString()
//             var compiled = handlebars.compile(source);
//             compiledTempaltes[name + "-" + type] = compiled;
//         } else{
//             console.log("FAILED TO COMPILE TEMPLATE", err);
//         }
//     } );
// }
