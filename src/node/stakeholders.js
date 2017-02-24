var envUtil = require("./util/envUtil.js");
var ParseCloud = require("parse-cloud-express");
var Parse = ParseCloud.Parse;
import Raven from "raven"
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

            let dealQueryResult = (new Parse.Query("Deal")).get(dealId, {useMasterKey: true})
            let userQuery = new Parse.Query("User");
            userQuery.equalTo("email", stakeholder.email.toLowerCase())
            let userQueryResult = userQuery.first({useMasterKey: true});

            console.log("looking for existing user with email = " + stakeholder.email);
            let deal = await dealQueryResult;
            console.log("found deal", deal.toJSON());
            let user = await userQueryResult;
            if ( user != null){
                console.log( "found user with email = " + user.get("email") );

                let existingStakeholderQuery = new Parse.Query("Stakeholder");
                existingStakeholderQuery.equalTo("deal", deal);
                existingStakeholderQuery.equalTo("user", user);
                let foundStakeholders = await existingStakeholderQuery.find({useMasterKey: true})
                if ( foundStakeholders.length > 0 ){
                    response.error({error: "this user is already a stakeholder.", exists: true})
                }
                else {
                    response.success({user: user});
                }
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
            Raven.captureException(e)
        }

    });

    Parse.Cloud.define("getUserWithEmail", function(request, response){
        let {userId} = request.params;
        new Parse.Query(Parse.User).get(userId, {useMasterKey: true}).then(function(user){
            console.log("found user: ", user);
            return response.success({user: user});
        })
        .catch(error => {
            Raven.captureException(error)
            response.error(error)
        });
    });

    Parse.Cloud.define("saveNewPassword", function(request, response) {
        var password = request.params.password;
        var userId = request.params.userId;
        console.log("saving new password", JSON.stringify(request.params))
        // var stakeholderId = request.params.stakeholderId;
        new Parse.Query(Parse.User).get(userId, {useMasterKey: true}).then(function(user){
            console.log("saveNewPassword: found user: " + userId);
            if ( user.get("passwordChangeRequired") )
            {
                //we can change the password
                user.set("password", password);
                user.set("passwordChangeRequired", false);
                Parse.Cloud.useMasterKey();
                user.save(null, {useMasterKey: true}).then(user => {
                    console.log("successfully changed password");
                    response.success({message: "succesfully saved the user's password"})
                }).catch(error => {
                    Raven.captureException(error)
                    response.error({message: "Failed to update the user's password", error: error})

                });
            }
        }).catch(e => {
            console.error(e)
            Raven.captureException(e)
        })
    });

    Parse.Cloud.define("validateStakeholder", async function(request, response){
        let userId = request.user.id;
        let dealId = request.params.dealId;
        let deal = {
            __type: "Pointer",
            className: "Deal",
            objectId: dealId
        }
        let stakeholderQuery = new Parse.Query("Stakeholder");
        stakeholderQuery.equalTo("user", request.user);
        stakeholderQuery.equalTo("deal", deal);
        try{
            let result = await stakeholderQuery.find();
            console.log("result", result);
            if ( result.length > 0 ){
                return response.success({
                    message: "User" + userId + " is a stakeholder for deal " + dealId,
                    authorized: true,
                    stakeholder: result[0].toJSON()
                })
            }
            else{
                return response.success({
                    message: "The user is not authorized for this deal.",
                    authorized: false
                });
            }
        } catch(error){
            console.error(error);
            Raven.captureException(error)
            return response.error({
                message: "something went wrong looking up the stakeholder",
                authorized: false
            });
        }
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
                Raven.captureException(error)
                reject( {error: "failed to create stakeholder user."} );
            }
        });
    });
}
