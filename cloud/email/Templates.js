var NewCommentEmail = require( "cloud/email/notification/NewCommentEmail" );


exports.templates = {
    "newComment": {
        name: "commentnotification",
        getTemplate: function( opts ){
            return new NewCommentEmail( opts );
        }
    }
};

exports.getTemplate = function( name, opts )
{
    return this.templates[name].getTemplate( opts );
};
