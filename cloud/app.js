var express = require('express');
var moment = require('moment');
var _ = require('underscore');
var ejs = require('ejs');
var ParseServer = require('parse-server').ParseServer;
var S3Adapter = require('parse-server').S3Adapter;
var bodyParser = require('body-parser')
var Mandrill = require('mandrill-api/mandrill');

var Notifications = require("./notification/Notifications.js");
var envUtil = require("./util/envUtil.js");
var Stakeholders = require('./stakeholders.js');



var app = express();
app.engine('ejs', ejs.__express);
app.use(bodyParser.json());
app.use('/parse', getParseServer());
app.use("/static", express.static(__dirname + './../public'));
app.set('views', 'cloud/views');

app.locals.formatTime = function(time) {
    return moment(time).format('MMMM Do YYYY, h:mm a');
};

app.get("*", function( request, response ){
    var env = envUtil.getEnv();
    var homePage = env.isDev ? "index.ejs" : "construction.ejs";
    var params = env.json;

    response.render( homePage, params);
});

Notifications.initialize();
Stakeholders.initialize();

var port = 1337;
app.listen(port, function() {
    console.log('parse-server OneRoost running on port ' + port + '.');
});
// app.listen();


function getParseServer()
{
    return new ParseServer({
        databaseURI: 'mongodb://oneroost:oneroost@ds013941.mlab.com:13941/oneroost-db',
        cloud: 'main.js',
        appId: 'TFy4TyyJJGpG7gnOUWzOZNtMcCkqQlYTfa4mJWQq', //dev
        fileKey: 'myFileKey',
        masterKey: 'RQ50598LZUsDXzgnz6HgnGSwlCuv6XrZ3h7Li13P',
        push: {}, // See the Push wiki page
        serverURL: 'http://localhost:1337/parse',
        // liveQuery: {
        //     classNames: ['User', 'Account', 'Deal', 'DealComment', 'NextStep', 'Stakeholder']
        // },
        filesAdapter:  new S3Adapter(
            "AKIAIJI2VKVQPR4V4JYA",
            "HYS3LqjQV/0Ej6COtVAow7M0xhe6GV3h7fWPkR9K",
            "parse-direct-access",
            {directAccess: true}
        )
    });
}
