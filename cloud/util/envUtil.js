var appEnv = null;

var APP_ID = process.env.PARSE_APP_ID || "TFy4TyyJJGpG7gnOUWzOZNtMcCkqQlYTfa4mJWQq";
var MASTER_KEY = process.env.PARSE_MASTER_KEY || "RQ50598LZUsDXzgnz6HgnGSwlCuv6XrZ3h7Li13P";
var DATABASE_URL = process.env.DATABASE_URL || "mongodb://localhost:27017/oneroost-db";
var PARSE_MOUNT = process.env.PARSE_MOUNT || "/parse";
var PARSE_PORT = process.env.PARSE_PORT || 8081;
var AWS_ID = process.env.AWS_ID || "AKIAIJI2VKVQPR4V4JYA";
var AWS_SECRET_ID = process.env.AWS_SECRET_ID || "HYS3LqjQV/0Ej6COtVAow7M0xhe6GV3h7fWPkR9K";
var SERVER_URL = process.env.PARSE_SERVER_URL || "http://localhost"
var HOSTNAME = process.env.HOSTNAME || "http://localhost:" + PARSE_PORT

var DOCUMENTS_S3_BUCKET = "oneroost-documents";
var DOCUMENTS_PATH = "documents"

if ( SERVER_URL.trim().indexOf("http:") != 0 )
{
    if ( SERVER_URL.indexOf("//") != 0 )
    {
        SERVER_URL = "//" + SERVER_URL;
    }
    SERVER_URL = "http:" + SERVER_URL;
}

if ( SERVER_URL.indexOf("localhost") != -1 )
{
    SERVER_URL += ":" + PARSE_PORT;
}
SERVER_URL += PARSE_MOUNT;

console.log("APP_ID: " + APP_ID);
console.log("MASTER_KEY: " + MASTER_KEY);
console.log("DATABASE_URL: " + DATABASE_URL);
console.log("PORT: " + PARSE_PORT);
console.log("PARSE_MOUNT: " + PARSE_MOUNT);
console.log("SERVER_URL: " + SERVER_URL);

exports.getParseServerUrl = function(){
    return SERVER_URL;
}

exports.getParseAppId = function(){
    return APP_ID;
}

exports.getParseMasterKey = function(){
    return MASTER_KEY;
}

exports.getDatabaseUrl = function(){
    return DATABASE_URL;
}

exports.getParseMount = function(){
    return PARSE_MOUNT;
}

exports.getParsePort = function(){
    return PARSE_PORT;
}

exports.getAwsId = function(){
    return AWS_ID;
}

exports.getAwsSecretId = function(){
    return AWS_SECRET_ID;
}

exports.getHost = function(){
    return HOSTNAME;
}

exports.isDev = function(){
    return HOSTNAME.indexOf("localhost") != -1
}

exports.getDocumentsBucket = function(){
    return DOCUMENTS_S3_BUCKET;
}

exports.getDocumentsPath = function(){
    return DOCUMENTS_PATH;
}

exports.getEnv = function(){
    if ( appEnv == null )
    {
        var javascriptKey = "";
        var isDev = true;
        var envName;
        var mandrillAppId = "dmCF3Rb55CIbJVvnzB4uzw";
        var domain = "";

        switch (APP_ID)
        {
            case "TFy4TyyJJGpG7gnOUWzOZNtMcCkqQlYTfa4mJWQq": //dev
            javascriptKey = "CZfXoAnHhHU46Id1GBZ0zB9LFKHZI0HZJt1GfTlo";
            isDev = true;
            envName = "dev";
            domain = "dev.oneroost.com"
            break;
            case "lSNtmvBTimEY6VfOo5zvvOQkljcHeDIOQcjefNUu": //prod
            javascriptKey = "EZKlfRO9ydZrpO2fpLkIRNTp9dEJxF4IyTh4VkWT";
            isDev = false;
            envName = "prod";
            domain = "www.oneroost.com";
            break;
            case "llcq2KXGOGoOQMO9W1rvgFcramBjAMgZEVRhNagb": //stage
            javascriptKey = "y6EMasJca2ez13ff88AW6XEFaIEHaqi0xTejTpFP";
            isDev = true;
            envName = "stage";
            domain = "stage.oneroost.com";
            break;
        }
        var props = {
            "applicationId": APP_ID,
            "javascriptKey": javascriptKey,
            "isDev": isDev,
            "envName": envName,
            "mandrillAppId": mandrillAppId,
            "domain": domain,
            "serverURL": SERVER_URL
        };

        var json = JSON.stringify( props );
        props.json = {"env": json};
        appEnv = props;
    }

    return appEnv;
}
