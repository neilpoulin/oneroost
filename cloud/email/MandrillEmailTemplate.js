var envUtil = require("./../util/envUtil.js");

var Template = function( templateName ){
    this.globalMergeVars = {};
    this.mergeVars = {};
    this.mergeLanguage = "handlebars";
    this.recipients = [];
    this.fromName = "OneRoost Notifications";
    this.fromEmail = "info@oneroost.com";
    this.subject = "new Notification from OneRoost";
    this.bccAddress = null;
    this.tags = [];
    this.attachments = [];
    this.async = true;
    this.headers = {};
    this.text = "";
    this.html = "";
    this.templateName = templateName;
    this.templateContent = [];
    this.images = [];
    this.appId = envUtil.getEnv().mandrillAppId;
};

module.exports.Template = Template;

Template.prototype.setFromName = function( fromName )
{
    this.fromName = fromName;
    return this;
}

Template.prototype.putGlobalVar = function( name, object )
{
    this.globalMergeVars[name] = object;
    return this;
};

Template.prototype.putMergeVar = function( email, name, object )
{
    var value = this.mergeVars[email] || {};
    value[name] = object;
    this.mergeVars[email] = value;
    return this;
};

Template.prototype.addImage = function( image )
{
    this.images.push( image );
    return this;
}

Template.prototype.setText = function( text )
{
    this.text = text;
    return this;
}

Template.prototype.setHtml = function( html )
{
    this.html = html;
    return this;
}

Template.prototype.addHeader = function( name, value )
{
    this.headers[name] = value;
    return this;
}

Template.prototype.setAsync = function( isAsync )
{
    this.async = isAsync;
    return this;
};

Template.prototype.addAttachment = function( attachment )
{
    this.attachments.push( attachment );
    return this;
};

Template.prototype.setTags = function( tags )
{
    this.tags = tags;
    return this;
};

Template.prototype.addTag = function( tag )
{
    this.tags.push( tag );
    return this;
};

Template.prototype.setMergeLanguage = function( language )
{
    this.mergeLanguage = language;
    return this;
};

Template.prototype.setRecipients = function( recipients )
{
    this.recipients = recipients;
    return this;
};

Template.prototype.addRecipient = function( name, email )
{
    this.recipients.push( {name: name, email: email} );
    return this;
}

Template.prototype.setSubject = function( subject )
{
    this.subject = subject;
    return this;
}

Template.prototype.setBccAddress = function( email )
{
    this.bccAddress = email;
    return this;
}

Template.prototype.get = function()
{
    if ( this.templateName == null ) {
        console.error( "you must provide a template name");
        throw "You must provide a template name";
    }

    var globalVars = [];
    var mergeVars = [];
    var obj = {};

    for ( var key in this.globalMergeVars )
    {
        if ( !this.globalMergeVars.hasOwnProperty( key ) ) continue;
        globalVars.push({
            name: key,
            content: this.globalMergeVars[key]
        });
    }

    for ( var rcpt in this.mergeVars )
    {
        if ( !this.mergeVars.hasOwnProperty( rcpt ) ) continue;
        var vars = [];
        for ( var rkey in this.mergeVars[rcpt] )
        {
            if ( !this.mergeVars[rcpt].hasOwnProperty( rkey ) ) continue;
            vars.push({
                name: rkey,
                content: this.mergeVars[rcpt][rkey]
            });
        }

        mergeVars.push({
            rcpt: rcpt,
            vars: vars
        });
    }
    var obj = {};
    obj.template_name = this.templateName;
    obj.template_content = this.templateContent;

    var msg = {};
    msg.global_merge_vars = globalVars;
    msg.merge_vars = mergeVars;
    msg.merge_language = this.mergeLanguage;
    msg.merge = true;
    msg.inline_css = true;
    msg.to = this.recipients;
    msg.subject = this.subject;
    msg.from_name = this.fromName;
    msg.from_email = this.fromEmail;
    msg.bcc_address = this.bccAddress;
    msg.tags = this.tags;
    msg.attachments = this.attachments;
    msg.headers = this.headers;
    msg.html = this.html;
    msg.text = this.text;
    msg.images = this.images;

    obj.message = msg;
    obj.async = this.async;
    obj.key = this.appId;
    return obj;
};
