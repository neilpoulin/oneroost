var express = require('express');
var moment = require('moment');
var _ = require('underscore');
var userController = require("cloud/controllers/userController.js");
var envUtil = require("cloud/util/envUtil.js");
var Mandrill = require('mandrill');
Mandrill.initialize('dmCF3Rb55CIbJVvnzB4uzw');


var ejs = require('ejs');
// ejs.open= '{%';
// ejs.close = '%}';

var app = express();

// Global app configuration section.
app.use(express.bodyParser());
app.engine('ejs', ejs.__express);
app.set('views', 'cloud/views');

app.locals.formatTime = function(time) {
  return moment(time).format('MMMM Do YYYY, h:mm a');
};

var parseConfig = Parse.Config.current();

// app.get("/", usersController.index);
app.get("/", function( request, response ){
    var env = envUtil.getEnv();
    var homePage = env.isDev ? "home.ejs" : "construction.ejs";
    var params = env.json;
    getConfig();
    console.log(parseConfig);
    console.log( parseConfig.get( "landing_motto" ) ) ;

    response.render( homePage, params);
});

Parse.Cloud.afterSave( 'NextStep', function( req, resp ){
    var step = req.object;
    // Mandrill.sendEmail({
    //   message: {
    //     text: "Body: " + step.get('description'),
    //     subject: "Next Step marked as " + ( step.get('completedDate') != null ? 'Done: ' : 'Not Done: ' ) + step.get('title'),
    //     from_email: "info@oneroost.com",
    //     from_name: "OneRoost Dev",
    //     to: [
    //       {
    //         email: "neil.j.poulin@gmail.com",
    //         name: "Neil Poulin"
    //       }
    //     ]
    //   },
    //   async: true
    // },{
    //   success: function(httpResponse) {
    //     console.log(httpResponse);
    //     resp.success("Email sent!");
    //   },
    //   error: function(httpResponse) {
    //     console.error(httpResponse);
    //     resp.error("Uh oh, something went wrong");
    //   }
    // });

});

app.get("/notifications", function( request, response ){
  console.log("attempting to post to /notifications");
  Mandrill.sendEmail({
    message: {
      text: "testing more stuff",
      subject: "testing",
      from_email: "info@oneroost.com",
      from_name: "OneRoost Dev",
      to: [
        {
          email: "neil.j.poulin@gmail.com",
          name: "Neil Poulin"
        }
      ]
    },
    async: false
  },{
    success: function(httpResponse) {
      console.log(httpResponse);
      response.success("Email sent!");
    },
    error: function(httpResponse) {
      console.error(httpResponse);
      response.error("Uh oh, something went wrong");
    }
  });
  response.send("thanks again");
});


function sendNextStepCreatedEmail( user, nextStep ){
  Mandrill.sendEmail({
    message: {
      text: "email testing",
      subject: "new Next Step Created",
      from_email: "info@oneroost.com",
      from_name: "OneRoost Dev",
      to: [
        {
          email: "neil.j.poulin@gmail.com",
          name: "Neil Poulin"
        }
      ]
    },
    async: false
  },{
    success: function(httpResponse) {
      console.log(httpResponse);
      response.success("Email sent!");
    },
    error: function(httpResponse) {
      console.error(httpResponse);
      response.error("Uh oh, something went wrong");
    }
  });
}

function getConfig()
{
  console.log("attempting to get config");
  Parse.Config.get().then( function(config){
    console.log("Successfully retrieved new config");
    console.log(config);
    parseConfig = config;
  },
  function(error){
    console.log("error... failed to get config");
    console.log(error);
    parseConfig = Parse.Config.current();
  });

  return parseConfig;
}

app.get("/my/home", userController.getMyHome );
app.get("/deals/:dealId", function(req, resp){
    var dealId =req.params.dealId;
    userController.getDealPage( req, resp, dealId );
});


app.listen();
