var express = require("express");
var moment = require("moment");
var ejs = require("ejs");
var ParseServer = require("parse-server").ParseServer;
var S3Adapter = require("parse-server").S3Adapter;
var bodyParser = require("body-parser")

var Notifications = require("./notification/Notifications.js");
var envUtil = require("./util/envUtil.js");
var Stakeholders = require("./stakeholders.js");
var SES = require("./email/SESEmailSender.js");

var app = express();
app.engine("ejs", ejs.__express);
app.use(bodyParser.json());
app.use("/parse", getParseServer());
app.use("/static", express.static(__dirname + "./../public"));
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

Notifications.initialize();
Stakeholders.initialize();


app.listen(port, function() {
    console.log("parse-server OneRoost running on port " + port + ".");
});
// app.listen();

function getParseServer()
{
    return new ParseServer({
        databaseURI: envUtil.getDatabaseUrl(),
        cloud: "main.js",
        appId: envUtil.getParseAppId(), //dev
        fileKey: "myFileKey",
        masterKey: envUtil.getParseMasterKey(),
        push: {}, // See the Push wiki page
        // liveQuery: {
        //     classNames: ["User", "Account", "Deal", "DealComment", "NextStep", "Stakeholder"]
        // },
        serverURL: envUtil.getParseServerUrl(),
        filesAdapter:  new S3Adapter(
            envUtil.getAwsId(),
            envUtil.getAwsSecretId(),
            "parse-direct-access",
            {directAccess: true}
        )
    });
}
