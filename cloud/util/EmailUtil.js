exports.getRecipientsFromStakeholders = function( stakeholders, excludedEmail )
{
    var recipients = [];
    console.log("processing " + stakeholders.length + " stakeholder emails. Excluding = " + excludedEmail );
    for ( var i = 0; i < stakeholders.length; i++ )
    {
        var user = stakeholders[i].get("user");
        if ( !excludedEmail || user.get("email") != excludedEmail )
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
    console.log("retrieved recipients for the list of stakeholders.");
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
            overrides.push({email: overrideEmails[i], name: overrideEmails[i]});
        }
        return overrides;
    }
    return original;
}
