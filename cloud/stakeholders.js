var envUtil = require('./util/envUtil.js');
var ParseCloud = require('parse-cloud-express');
var Parse = ParseCloud.Parse;
Parse.serverURL = envUtil.serverURL;
exports.initialize = function()
{
    console.log("initializing stakeholder triggers");
    Parse.Cloud.define("addStakeholder", function(request, response) {
        var dealId = request.params.dealId;
        var stakeholder = request.params.stakeholder;

        new Parse.Query("Deal").get( dealId , {
            success: function( deal ){
                console.log("deal found..trying to find the user with email = " + stakeholder.email );
                new Parse.Query("User").equalTo( "email", stakeholder.email ).first({
                    success: function( user ){
                        if ( user != null)
                        {
                            console.log( "found user with email = " + user.get("email") );
                            var callback = new function( message ){
                                var responseObject = {
                                    deal: deal,
                                    user: user,
                                    message: message,
                                };
                                response.success( responseObject );
                            };
                        }
                        else
                        {
                            console.log( "no user found with email = " + stakeholder.email );
                            createStakeholderUser( stakeholder, deal, Parse.User.current(), response );
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
}

function createStakeholderUser( stakeholder, deal, invitedBy, response ){
    console.log("creating new stakeholder user with email " + stakeholder.email + " for dealId = " + deal.id + ", invited by userId = " + invitedBy.id );
    var user = new Parse.User();
    user.set( "email", stakeholder.email );
    user.set( "username", stakeholder.email );
    user.set( "firstName", stakeholder.firstName );
    user.set( "lastName", stakeholder.lastName );
    user.set( "password", deal.id );
    user.set( "sourceDeal", deal );
    user.set( "invitedBy", invitedBy );
    user.signUp( null, {
        success: function(created){
            console.log( "successfully created a user to be added as a stakeholder." );
            response.success({user: created});
        },
        error: function( created, error ){
            console.error( "failed to create stakeholder user." );
            response.error( {error: "failed to create stakeholder user."} );
        }
    });
}
