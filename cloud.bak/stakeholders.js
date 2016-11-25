var envUtil = require("./util/envUtil.js");
var ParseCloud = require("parse-cloud-express");
var Parse = ParseCloud.Parse;
Parse.serverURL = envUtil.serverURL;
exports.initialize = function()
{
    console.log("initializing stakeholder triggers");
    Parse.Cloud.define("addStakeholder", function(request, response) {
        var dealId = request.params.dealId;
        var stakeholder = request.params.stakeholder;
        var currentUser = request.user;
        new Parse.Query("Deal").get( dealId , {
            success: function( deal ){
                console.log("deal found..trying to find the user with email = " + stakeholder.email );
                new Parse.Query("User").equalTo( "email", stakeholder.email ).first({
                    success: function( user ){
                        if ( user != null)
                        {
                            console.log( "found user with email = " + user.get("email") );
                            response.success({user: user});
                        }
                        else
                        {
                            console.log( "no user found with email = " + stakeholder.email );

                            createStakeholderUser( stakeholder, deal, currentUser, response );
                        }
                    },
                    error: function(error){
                        console.error("failed to find user, something went wrong");
                        console.error(error);
                        response.success({
                            error: "something went wrong"
                        });
                    }
                });
            },
            error: function(){
                response.error();
            }
        });
    });

    Parse.Cloud.define("saveNewPassword", function(request, response) {
        var password = request.params.password;
        var userId = request.params.userId;
        // var stakeholderId = request.params.stakeholderId;
        new Parse.Query(Parse.User).get(userId).then(function(user){
            console.log("saveNewPassword: found user: " + userId);
            if ( user.get("passwordChangeRequired") )
            {
                //we can change the password
                user.set("password", password);
                user.set("passwordChangeRequired", false);
                Parse.Cloud.useMasterKey();
                user.save().then(function(user){
                    console.log("successfully changed password");
                    response.success({message: "succesfully saved the user's password"})
                });
            }
        })

    });
}

function createStakeholderUser( stakeholder, deal, invitedBy, response ){
    console.log("creating new stakeholder user with email " + stakeholder.email + " for dealId = " + deal.id + ", invited by userId = " + invitedBy.id );
    var user = new Parse.User();
    user.set( "email", stakeholder.email );
    user.set( "username", stakeholder.email );
    user.set( "firstName", stakeholder.firstName );
    user.set( "lastName", stakeholder.lastName );
    user.set( "company", stakeholder.company );
    user.set( "password", deal.id );
    user.set( "sourceDeal", deal );
    user.set( "invitedBy", invitedBy );
    user.set( "passwordChangeRequired", true );
    user.setACL();
    user.signUp( null, {
        success: function(created){
            console.log( "successfully created a user to be added as a stakeholder." );
            response.success({user: created});
        },
        error: function( created, error ){
            console.error( "failed to create stakeholder user.", error );
            response.error( {error: "failed to create stakeholder user."} );
        }
    });
}