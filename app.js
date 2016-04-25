var express = require('express');
var moment = require('moment');
var _ = require('underscore');
var envUtil = require("./cloud/util/envUtil.js");
var Stakeholders = require('./cloud/stakeholders.js');
var Mandrill = require('mandrill-api/mandrill');
var Notifications = require("./cloud/notification/Notifications.js");
var ejs = require('ejs');
var ParseServer = require('parse-server').ParseServer;
var S3Adapter = require('parse-server').S3Adapter;
var bodyParser = require('body-parser')
var app = express();

var api = new ParseServer({
  databaseURI: 'mongodb://oneroost:oneroost@ds013941.mlab.com:13941/oneroost-db',
  cloud: './main.js',
  appId: 'TFy4TyyJJGpG7gnOUWzOZNtMcCkqQlYTfa4mJWQq', //dev
  fileKey: 'myFileKey',
  masterKey: 'RQ50598LZUsDXzgnz6HgnGSwlCuv6XrZ3h7Li13P',
  push: {}, // See the Push wiki page
  serverURL: 'http://localhost:1337/parse',
  filesAdapter:  new S3Adapter(
    "AKIAIJI2VKVQPR4V4JYA",
    "HYS3LqjQV/0Ej6COtVAow7M0xhe6GV3h7fWPkR9K",
    "parse-direct-access",
    {directAccess: true}
  )
});

// Global app configuration section.
app.use(bodyParser.json());
// Serve the Parse API at /parse URL prefix
app.use('/parse', api);
app.use(express.static(__dirname + '/public'));
app.engine('ejs', ejs.__express);
app.set('views', 'cloud/views');

app.locals.formatTime = function(time) {
  return moment(time).format('MMMM Do YYYY, h:mm a');
};

app.get("*", function( request, response ){
    var env = envUtil.getEnv();
    var homePage = env.isDev ? "index.ejs" : "construction.ejs";
    var params = env.json;

    debugger;
    response.render( homePage, params);
});

Notifications.initialize();
Stakeholders.initialize();

var port = 1337;
app.listen(port, function() {
  console.log('parse-server OneRoost running on port ' + port + '.');
});
// app.listen();
