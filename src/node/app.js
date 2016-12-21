require("console-stamp")(console, {
    pattern:"HH:MM:sstt ddd yyyy-mm-dd",
    colors: {
        stamp: "yellow",
        label: "white",
        metadata: "green"
    }
});
import express from "express"
import moment from "moment"
import ejs from "ejs"
import {ParseServer} from "parse-server"
import ParseDashboard from "parse-dashboard"
import ParseDashboardConfig from "./parse-dashboard-config.json"
import {S3Adapter} from "parse-server"
import bodyParser from "body-parser"
import SESParseAdapter from "./email/SESParseAdapter.js"
import favicon from "serve-favicon"
import Notifications from "./notification/Notifications.js"
import envUtil from "./util/envUtil.js"
import Stakeholders from "./stakeholders.js"
import http from "http"
import socket from"socket.io"
import TemplateUtil from"./util/TemplateUtil"
import Documents from "./documents/Documents"
import ReadyRoost from "./roost/ReadyRoost"
import BeforeSave from "./triggers/BeforeSave"
import AWSXRay from "aws-xray-sdk";
AWSXRay.setDefaultName(envUtil.getEnvName());
var app = express();
app.use(AWSXRay.express.openSegment());

var server = http.Server(app);
var io = socket(server);
app.engine("ejs", ejs.__express);
app.use(bodyParser.json());
app.use("/parse", getParseServer());
app.use("/admin/dashboard", getParseDashboard());
app.use("/static", express.static(__dirname + "./../public"));
app.use(favicon(__dirname + "./../public/favicon.ico"));
app.set("views", "cloud/views");

var port = envUtil.getParsePort();
app.locals.formatTime = function(time) {
    return moment(time).format("MMMM Do YYYY, h:mm a");
};


app.get("/admin/emails/:templateName", function(req, resp){
    TemplateUtil.renderSample(req.params.templateName).then(function(templates){
        resp.render("emailSample.ejs", templates);
    });
});

app.get("/admin/emails/:templateName/:number", function(req, resp){
    TemplateUtil.renderSample(req.params.templateName, req.params.number).then(function(templates){
        resp.render("emailSample.ejs", templates);
    });
});


app.get("*", function( request, response ){
    var env = envUtil.getEnv();
    var homePage = "index.ejs";
    var params = env.json;
    response.render( homePage, params);
});

io.on("connection", function(socket){
    //no op here - will join namespaced rooms later
  socket.on("disconnect", function(){
    //no op
  });
}).on("error", function(error){
    console.log("recieved a websocket error: ", error);
});

BeforeSave.initialize();
Notifications.initialize(io);
Documents.initialize();
Stakeholders.initialize();
ReadyRoost.initialize();

app.use(AWSXRay.express.closeSegment());

process.on("uncaughtException", function(err){
    console.error(err.stack)
    server.close();
})
process.on("SIGTERM", function(err){
    console.error(err.stack)
    server.close();
})
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
        emailAdapter: SESParseAdapter({}),
        filesAdapter:  new S3Adapter(
            envUtil.getAwsId(),
            envUtil.getAwsSecretId(),
            "parse-direct-access",
            {directAccess: true}
        )
    });
}
