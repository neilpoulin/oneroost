var express = require('express');
var moment = require('moment');
var _ = require('underscore');
var userController = require("cloud/controllers/userController.js");
var envUtil = require("cloud/util/envUtil.js");
var emailTriggers = require('cloud/emailTriggers.js');
var Mandrill = require('mandrill');
var ejs = require('ejs');
var app = express();

// Global app configuration section.
app.use(express.bodyParser());
app.engine('ejs', ejs.__express);
app.set('views', 'cloud/views');

app.locals.formatTime = function(time) {
  return moment(time).format('MMMM Do YYYY, h:mm a');
};
// app.get("/", usersController.index);
app.get("/", function( request, response ){
    var env = envUtil.getEnv();
    var homePage = env.isDev ? "home.ejs" : "construction.ejs";
    var params = env.json;

    response.render( homePage, params);
});

app.get("/login", function( request, response){
    var env = envUtil.getEnv();
    var homePage = "home.ejs";
    var params = env.json;
    response.render( homePage, params );
});

app.get("/signup", function( request, response){
    var env = envUtil.getEnv();
    var homePage = "home.ejs";
    var params = env.json;
    response.render( homePage, params);
});

app.get("/my/home", userController.getMyHome );
app.get("/deals/:dealId", function(req, resp){
    var dealId =req.params.dealId;
    userController.getDealPage( req, resp, dealId );
});


emailTriggers.registerEmailTriggers();

Parse.Cloud.define("addStakeholder", function(request, response) {
    var dealId = request.params.dealId;
    var stakeholder = request.params.stakeholder;

    new Parse.Query("Deal").get( dealId , {
        success: function( deal ){
            console.log("deal found..trying to find the user with email = " + stakeholder.email );
            new Parse.Query(Parse.User).equalTo( "email", stakeholder.email ).first({
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
                        addUserToDeal( user, deal, stakeholder.role, Parse.User.current(), callback );
                    }
                    else
                    {
                        console.log( "no user found with email = " + stakeholder.email );
                        var callback = new function( message ){
                            response.success( {
                                success: "no user found with email = " + stakeholder.email + ", added new stakeholder",
                                extra: "field",
                                message: message || "no message"
                            });
                        };
                        createStakeholderUser( stakeholder, deal, Parse.User.current(), callback );
                    }
                },
                error: function(){
                    console.error("failed to find user, something went wrong");
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

function addUserToDeal( user, deal, role, invitedBy, responseCallback ){
    console.log( "adding user to stakeholder table" );
    var Stakeholder = Parse.Object.extend( "Stakeholder" );
    var stakeholder = new Stakeholder();
    stakeholder.set( "user", user );
    stakeholder.set( "deal", deal );
    stakeholder.set( "role", role );
    stakeholder.set( "inviteAccepted", false );
    stakeholder.set( "invitedBy", invitedBy );
    stakeholder.save(null, {
        success: function( stakeholder ){
            // console.log( "successfully saved stakeholder " + stakeholder.id );
            responseCallback( "added stakeholder" );
        },
        error: function(){
            console.error( "failed to save stakeholder" );
            responseCallback( "failed to save stakeholder mapping" );
        }
    });
}

function createStakeholderUser( stakeholder, deal, invitedBy, responseCallback ){
    // console.log("creating new stakeholder user with email " + stakeholder.email + " for dealId = " + deal.id + ", invited by userId = " + invitedBy.id );
    console.log( "creating new stakeholder user" );
    var user = new Parse.User();
    user.set( "email", stakeholder.email );
    user.set( "username", stakeholder.email );
    user.set( "firstName", stakeholder.firstName );
    user.set( "lastName", stakeholder.lastName );
    user.set( "password", deal.id );
    user.set( "sourceDeal", deal );
    user.set( "invitedBy", invitedBy );
    console.log( "using promises to signup" );
    user.signUp( null ).then(function(created){
            console.log( "successfully created a stakeholder user." );
            addUserToDeal( user, deal, stakeholder.role, invitedBy, responseCallback );


            // console.log( "adding user to stakeholder table" );
            // var Stakeholder = Parse.Object.extend( "Stakeholder" );
            // var stakeholder = new Stakeholder();
            // stakeholder.set( "user", created );
            // stakeholder.set( "deail", deal );
            // stakeholder.set( "role", stakeholder.role );
            // stakeholder.set( "inviteAccepted", false );
            // stakeholder.set( "invitedBy", invitedBy );
            // stakeholder.save(null, {
            //     success: function( stakeholder ){
            //         // console.log( "successfully saved stakeholder " + stakeholder.id );
            //         responseCallback( "added stakeholder" );
            //     },
            //     error: function(){
            //         console.error( "failed to save stakeholder" );
            //         responseCallback( "failed to save stakeholder mapping" );
            //     }
            // });


        },
        function( created, error ){
            console.error( "failed to create stakeholder user." );
            responseCallback( "failed to create stakeholder user." );
        }
    );
    console.log("end of create user function");
}


Parse.Cloud.afterSave( 'User', function( req, res ){
    console.log("User afterSave triggered");
    var user = req.object;
    if ( user.createdAt == user.updatedAt && user.sourceDeal != null )
    {
        
    }
});

app.listen();
