var Parse = ParseCloud.Parse

exports.Settings = {
    COMMENT_EMAILS: "commentEmails",
    INVITE_EMAILS: "inviteEmails",
    NEXT_STEP_EMAILS: "nextStepEmails"
}

exports.checkNotificationSettings = function( property, value, callback ){
    Parse.Config.get().then( function(config){
        var settings = config.get("notificationSettings");
        if ( settings[property] == value ){
            callback()
        }
    } );
}
