var Client = require("node-rest-client").Client;
var aws = require("aws-sdk");
var MailParser = require("mailparser").MailParser;

var PARSE_APP_ID = "TFy4TyyJJGpG7gnOUWzOZNtMcCkqQlYTfa4mJWQq";
var PARSE_REST_KEY = "pXy1rBiEEAYEdkFSR0kHu8zUWLshXpX2KuRjmVBH";
var domain = "http://aws.oneroost.com/parse";

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
    var headers = getHeaders();

    var fromAddress = mail.from[0].address;
    var references = parseToAddress( mail );
    var client = getClient();

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
                message: mail.text
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

function parseToAddress( mail ){
    var address = mail.to[0].address.split("@")[0].split("+");

    var type = address[0].toLowerCase();
    var id = address[1];

    return {
        className: getClassName(type),
        objectId: id
    }
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

function getClient( ){
    var client = new Client();
    client.registerMethod("getObject", domain + "/classes/${className}", "GET");
    client.registerMethod("postComment", domain + "/classes/DealComment", "POST");
    return client;
}

function getHeaders()
{
    return {
        "X-Parse-Application-Id": PARSE_APP_ID,
        "X-Parse-REST-API-Key": PARSE_REST_KEY,
        "Content-Type": "application/json"
    }
}
