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

app.get("/my/home", userController.getMyHome );
app.get("/deals/:dealId", function(req, resp){
    var dealId =req.params.dealId;
    userController.getDealPage( req, resp, dealId );
});


emailTriggers.registerEmailTriggers();


app.listen();
