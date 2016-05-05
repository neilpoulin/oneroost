var express = require('express');
var moment = require('moment');
var _ = require('underscore');
var envUtil = require("cloud/util/envUtil.js");
var Stakeholders = require('cloud/stakeholders.js');
var Mandrill = require('mandrill');
var Notifications = require("cloud/notification/Notifications.js");
var ejs = require('ejs');
var app = express();

// Global app configuration section.
app.use(express.bodyParser());
app.engine('ejs', ejs.__express);
app.set('views', 'cloud/views');

app.locals.formatTime = function(time) {
  return moment(time).format('MMMM Do YYYY, h:mm a');
};

<<<<<<< HEAD
app.get("*", function( request, response ){
=======
var parseConfig = Parse.Config.current();

// app.get("/", usersController.index);
app.get("/", function( request, response ){
<<<<<<< HEAD
  response.render("construction.ejs");
=======
>>>>>>> master
    var env = envUtil.getEnv();
    var homePage = env.isDev ? "index.ejs" : "construction.ejs";
    var params = env.json;

    response.render( homePage, params);
>>>>>>> develop
});

Notifications.initialize();
Stakeholders.initialize();

app.listen();
