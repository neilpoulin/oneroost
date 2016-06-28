require("console-stamp")(console, {
    pattern:"HH:MM:sstt ddd yyyy-mm-dd",
    colors: {
        stamp: "yellow",
        label: "white",
        metadata: "green"
    }
});
var express = require("express");
var moment = require("moment");
var ejs = require("ejs");
var ParseServer = require("parse-server").ParseServer;
var ParseDashboard = require("parse-dashboard");
var ParseDashboardConfig = require("./parse-dashboard-config.json");
var S3Adapter = require("parse-server").S3Adapter;
var bodyParser = require("body-parser");
var SESEMailAdapter = require("./email/SESEMailAdapter.js");
var favicon = require("serve-favicon");
var Notifications = require("./notification/Notifications.js");
var envUtil = require("./util/envUtil.js");
var Stakeholders = require("./stakeholders.js");
var SES = require("./email/SESEmailSender.js");
var http = require("http");
var socket = require("socket.io");

var app = express();
var server = http.Server(app);
var io = socket(server);
app.engine("ejs", ejs.__express);
app.use(bodyParser.json());
app.use("/parse", getParseServer());
app.use("/dashboard", getParseDashboard());
app.use("/static", express.static(__dirname + "./../public"));
app.use(favicon(__dirname + "./../public/favicon.ico"));
app.set("views", "cloud/views");

var port = envUtil.getParsePort();
app.locals.formatTime = function(time) {
    return moment(time).format("MMMM Do YYYY, h:mm a");
};

app.get("*", function( request, response ){
    var env = envUtil.getEnv();
    var homePage = env.isDev ? "index.ejs" : "construction.ejs";
    var params = env.json;
    response.render( homePage, params);
});

app.post("/email", function(req, resp){
    var email = req.body;
    var status = SES.sendEmail( email );
    resp.setHeader("Content-Type", "application/json");
    resp.send(JSON.stringify(status));
});

io.on("connection", function(socket){
    //no op here - will join namespaced rooms later
  socket.on("disconnect", function(){
    //no op
  });
}).on("error", function(error){
    console.log("recieved a websocket error: ", error);
});

Notifications.initialize(io);
Stakeholders.initialize();

server.listen(port, function() {
    console.log("parse-server OneRoost running on port " + port + ".");
});

function getParseDashboard()
{
    var allowInsecure = true;
    return new ParseDashboard(ParseDashboardConfig, allowInsecure);
}

function getParseServer()
{
    return new ParseServer({
        databaseURI: envUtil.getDatabaseUrl(),
        cloud: "main.js",
        appId: envUtil.getParseAppId(), //dev
        fileKey: "myFileKey",
        masterKey: envUtil.getParseMasterKey(),
        push: {}, // See the Push wiki page
        liveQuery: {
            // classNames: ["User", "Account", "Deal", "DealComment", "NextStep", "Stakeholder"]
            classNames: ["DealComment"]
        },
        serverURL: envUtil.getParseServerUrl(),
        publicServerURL: envUtil.getParseServerUrl(),
        appName: "One Roost",
        emailAdapter: SESEMailAdapter({}),
        filesAdapter:  new S3Adapter(
            envUtil.getAwsId(),
            envUtil.getAwsSecretId(),
            "parse-direct-access",
            {directAccess: true}
        )
    });
}
