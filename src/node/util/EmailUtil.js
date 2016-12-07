import {Parse} from "parse-cloud-express"

var TempalteUtil = require("./TemplateUtil");

exports.renderEmail = function(name, data){
    return TempalteUtil.renderEmail(name, data);
}

exports.getRecipientsFromStakeholders = function( stakeholders, excludedEmails )
{
    var recipients = [];
    excludedEmails = excludedEmails || [];
    if ( !(excludedEmails instanceof Array) )
    {
        excludedEmails = [excludedEmails];
    }
    console.log("processing " + stakeholders.length + " stakeholder emails. Excluding = " + excludedEmails + ":", stakeholders );
    for ( var i = 0; i < stakeholders.length; i++ )
    {
        var stakeholder = stakeholders[i];
        if ( !stakeholder.get("inviteAccepted") )
        {
            console.log("The stakeholder has not accepted the invitation, skipping", stakeholder);
            continue;
        }

        var user = stakeholder.get("user");
        if ( excludedEmails.indexOf( user.get("email") ) == -1)
        {
            var recipient = {
                email: user.get("email"),
                name: user.get("firstName") + " " + user.get("lastName")
            };
            recipients.push( recipient );
        }
        else
        {
            console.log( "excluding author from email");
        }
    }
    console.log("retrieved recipients for the list of stakeholders:", recipients);
    return recipients;
}

exports.getActualRecipients = function( original, config )
{    
    var emailOverride = config.get( "emailOverride");
    if ( emailOverride )
    {
        var overrides = [];
        var overrideEmails = emailOverride.replace(/ /g, "").split(",");
        for ( var i = 0; i < overrideEmails.length; i++ )
        {
            overrides.push({email: overrideEmails[i], name: original.name});
        }
        return overrides;
    }
    return original;
}

exports.getActualRecipientsForDeal = async function( deal, excludedEmails ){
    var stakeholderQuery = new Parse.Query("Stakeholder");
    stakeholderQuery.include( "user" );
    stakeholderQuery.equalTo( "deal", deal );
    let stakeholders = await stakeholderQuery.find();
    var recipients = this.getRecipientsFromStakeholders( stakeholders, excludedEmails );
    return recipients;
}
