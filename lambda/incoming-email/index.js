var Client = require("node-rest-client").Client;
var MailParser = require("mailparser").MailParser;
var replyParser = require("./parse-reply");

var PARSE_APP_ID_STAGE = "llcq2KXGOGoOQMO9W1rvgFcramBjAMgZEVRhNagb";
var PARSE_APP_ID_PROD = "lSNtmvBTimEY6VfOo5zvvOQkljcHeDIOQcjefNUu";
var PARSE_APP_ID_DEV = "TFy4TyyJJGpG7gnOUWzOZNtMcCkqQlYTfa4mJWQq"

console.log("Loading event");

exports.handler = function(event, context, callback) {
    console.log("Email Ingest running v3");

    var record = event.Records[0];
    var message = record.Sns.Message;
    var email = JSON.parse(message);

    var mailparser = new MailParser();
    // setup an event listener when the parsing finishes
    mailparser.on("end", getProcessor(callback) );
    // send the email source to the parser
    mailparser.write(email.content);
    mailparser.end();
    return null;
};

function getProcessor( callback ){
    return function( mail_object ){
        console.log("mail_object:", mail_object);
        addMessage(mail_object, callback);
    }
}

function addMessage(mail, callback){
    var fromAddress = mail.from[0].address;
    var references = this.parseToAddress( mail );
    var client = getClient(references.env);
    var headers = getHeaders(references.env);

    client.methods.getObject({
        parameters: {where: JSON.stringify( {email: fromAddress} )},
        path: {className: "_User"},
        headers: headers
    }, function(data, response){
        var user = data.results[0];
        if ( user ){
            var comment = {
                deal: {
                    __type: "Pointer",
                    objectId: references.objectId,
                    className: "Deal"
                },
                author: {
                    __type: "Pointer",
                    objectId: user.objectId,
                    className: "_User"
                },
                message: replyParser.parseReply(mail.text)
            };

            var args = {
                data: comment,
                headers: headers
            }

            console.log("POSTing to comments: ", JSON.stringify( args ) );

            client.methods.postComment( args, function(data, response){
                console.log("commentData:", data);
                callback(null, null);
            } )
        }
    });
}

exports.parseToAddress = function( mail ){
    var address = mail.to[0].address.split("@")[0].split("+");
    var domain = mail.to[0].address.split("@")[1];
    var env = this.getEnvFromDomain(domain);

    var type = address[0].toLowerCase();
    var id = address[1];

    return {
        className: getClassName(type),
        objectId: id,
        env: env
    }
}

exports.getEnvFromDomain = function(domain){
    if ( domain.indexOf("dev.reply.oneroost.com") != -1 ){
        return "dev"
    } else if ( domain.indexOf("stage.reply.oneroost.com") != -1){
        return "stage"
    }
    return "prod"
}

function getClassName( type ){
    var className = null;
    switch (type) {
        case "user":
            className = "_User";
            break;
        case "dealcomment":
            className ="DealComment";
            break;
        case "deal":
        case "roost":
            className = "Deal";
            break;
        case "stakeholder":
            className = "Stakeholder";
            break;
        default:
            className = "";
    }
    return className;
}

function getClient( env ){
    var client = new Client();
    var host = getParseServerUrl(env);
    client.registerMethod("getObject", host + "/classes/${className}", "GET");
    client.registerMethod("postComment", host + "/classes/DealComment", "POST");
    return client;
}

function getParseServerUrl(env){
    env = env === "prod" ? "www" : env;
    return "http://" + env + ".oneroost.com/parse";
}

function getHeaders(env)
{
    return {
        "X-Parse-Application-Id": getAppId(env),
        // "X-Parse-REST-API-Key": PARSE_REST_KEY,
        "Content-Type": "application/json"
    }
}


function getAppId( env ){
    if ( env === "prod" ){
        return PARSE_APP_ID_PROD
    } else if ( env === "stage"){
        PARSE_APP_ID_STAGE
    }
    return PARSE_APP_ID_DEV
}
