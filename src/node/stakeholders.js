var envUtil = require("./util/envUtil.js");
var ParseCloud = require("parse-cloud-express");
var Parse = ParseCloud.Parse;
Parse.serverURL = envUtil.serverURL;
exports.initialize = function()
{
    console.log("initializing stakeholder triggers");
    Parse.Cloud.define("addStakeholder", async function(request, response) {
        try{
            console.log(request);

            var dealId = request.params.dealId;
            var stakeholder = request.params.stakeholder;
            var currentUser = request.user;
            if ( !currentUser ){
                return response.error({error:"you must be logged in to perform this action"});
            }
            console.log("request.stakeholder:", stakeholder);
            console.log("request.currentUser", currentUser);

            let dealQueryResult = (new Parse.Query("Deal")).get(dealId)
            let userQuery = new Parse.Query("User");
            userQuery.equalTo("email", stakeholder.email.toLowerCase())
            let userQueryResult = userQuery.first();

            console.log("looking for existing user with email = " + stakeholder.email);
            let deal = await dealQueryResult;
            console.log("found deal", deal.toJSON());
            let user = await userQueryResult;
            if ( user != null){
                console.log( "found user with email = " + user.get("email") );
                response.success({user: user});
            }
            else{
                console.log( "no user found with email = " + stakeholder.email + " ... will create" );
                let createdUser = await createStakeholderUser( stakeholder, deal, currentUser );
                response.success({user: createdUser});
            }
        }
        catch(e){
            console.error("Failed to execute addStakeholder function", e);
            response.error({error: "something went wrong", object: e });
        }

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

async function createStakeholderUser( stakeholder, deal, invitedBy ){
    return new Promise(function(resolve, reject){
        console.log("creating new stakeholder user with email " + stakeholder.email + " for dealId = " + deal.id + ", invited by userId = " + invitedBy.id );
        let user = new Parse.User();
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
                resolve(created)
            },
            error: function( created, error ){
                console.error( "failed to create stakeholder user.", error );
                reject( {error: "failed to create stakeholder user."} );
            }
        });
    });
}
