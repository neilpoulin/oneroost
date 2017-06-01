require("console-stamp")(console, {
    pattern: "HH:MM:sstt ddd yyyy-mm-dd",
    colors: {
        stamp: "yellow",
        label: "white",
        metadata: "green"
    }
});
import express from "express"
import moment from "moment"
import ejs from "ejs"
import bodyParser from "body-parser"
import favicon from "serve-favicon"
import {getParseServer, getParseDashboard, getLiveQueryServer} from "./parseServer"
import envUtil from "./util/envUtil.js"
import http from "http"
import socket from"socket.io"
import TemplateUtil from"./util/TemplateUtil"
import Triggers from "./triggers/triggers"
import AWSXRay from "aws-xray-sdk";
import compression from "compression";
import version from "./version.json";
import Raven from "raven"
import SecurityController from "./security/SecurityController";
Raven.config("https://50020b1e8db94c39be96db010cdbba4f:0f4123892fd44bfd92b85a003645fdc3@sentry.io/128546", {
    environment: envUtil.getEnvName(),
    release: version.hash,
    tags: {
        git_commit: version.hash,
        git_tag: version.version,
        platform: "node"
    }
}).install();

AWSXRay.config([AWSXRay.plugins.EC2]);
AWSXRay.config([AWSXRay.plugins.ElasticBeanstalk]);

var app = express();
var server = http.Server(app);

process.on("uncaughtException", function(err){
    console.error(err.stack)
    server.close();
})
process.on("SIGTERM", function(err){
    console.error(err.stack)
    server.close();
})

var io = socket(server);
app.use(AWSXRay.express.openSegment(envUtil.getEnvName()));
app.engine("ejs", ejs.__express);
app.use(bodyParser.json());
app.use("/parse", getParseServer());
app.use("/admin/dashboard", getParseDashboard());
app.use(favicon(__dirname + "./../public/favicon.ico"));
app.set("views", "cloud/views");

var port = envUtil.getParsePort();
app.locals.formatTime = function(time) {
    return moment(time).format("MMMM Do YYYY, h:mm a");
};

if (process.env.NODE_ENV === "production") {
    console.log("****PRODUCTION - USING BUNDLED ASSETS****")
    app.use(compression({level: 9}));
    app.use("/static", express.static(__dirname + "./../public"));
}
else {
    const devSetup = require("./dev");
    devSetup.intitialize(app);
}

app.use(function(req, res, next) {
    require("./routes")(req, res, next);
});

io.on("connection", function(socket){
    //no op here - will join namespaced rooms later
    socket.on("disconnect", function(){
        //no op
    });
}).on("error", function(error){
    console.log("recieved a websocket error: ", error);
});

Triggers.initialize(io)
TemplateUtil.initialize()
SecurityController.initialize();
app.use(AWSXRay.express.closeSegment());

server.listen(port, function() {
    console.log("parse-server OneRoost running on port " + port + ".");
});

getLiveQueryServer(server);
