var express = require('express');
var moment = require('moment');
var _ = require('underscore');
var usersController = require("cloud/controllers/userController.js");
var ejs = require('ejs');
ejs.open= '{%';
ejs.close = '%}';

var app = express();

// Global app configuration section.
app.use(express.bodyParser());
app.engine('ejs', ejs.__express);
app.set('views', 'cloud/views');

app.locals.formatTime = function(time) {
  return moment(time).format('MMMM Do YYYY, h:mm a');
};

app.get('/todo', function(request, response){
  //  response.redirect('/html/index.html', 301);
    response.render( 'todo.ejs', {} );
});

// app.get("/", usersController.index);
app.get("/", function( request, response ){
  response.render("react.ejs");
});

app.listen();
