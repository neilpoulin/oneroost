var express = require('express');
var moment = require('moment');
var _ = require('underscore');
var userController = require("cloud/controllers/userController.js");
var envUtil = require("cloud/util/envUtil.js");

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
