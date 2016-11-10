var appEnv = null;

var APP_ID = process.env.PARSE_APP_ID || "TFy4TyyJJGpG7gnOUWzOZNtMcCkqQlYTfa4mJWQq";
var MASTER_KEY = process.env.PARSE_MASTER_KEY || "RQ50598LZUsDXzgnz6HgnGSwlCuv6XrZ3h7Li13P";
var DATABASE_URL = process.env.DATABASE_URL || "mongodb://localhost:27017/oneroost-db";
var PARSE_MOUNT = process.env.PARSE_MOUNT || "/parse";
var PARSE_PORT = process.env.PARSE_PORT || 8081;
var AWS_ID = process.env.AWS_ID || "AKIAIJI2VKVQPR4V4JYA";
var AWS_SECRET_ID = process.env.AWS_SECRET_ID || "HYS3LqjQV/0Ej6COtVAow7M0xhe6GV3h7fWPkR9K";
var SERVER_URL = process.env.PARSE_SERVER_URL || "http://localhost"
var HOSTNAME = process.env.HOSTNAME || "http://dev.oneroost.com"
var ENV_NAME = process.env.ENV_NAME || "dev"
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
process.title = "oneroost-npm";
console.log("APP_ID: " + APP_ID);
console.log("MASTER_KEY: " + MASTER_KEY);
console.log("DATABASE_URL: " + DATABASE_URL);
console.log("PORT: " + PARSE_PORT);
console.log("PARSE_MOUNT: " + PARSE_MOUNT);
console.log("SERVER_URL: " + SERVER_URL);
console.log("ENV_NAME: " + ENV_NAME);
console.log("HOSTNAME: " + HOSTNAME);
console.log("node title: ", process.title);

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
    return ENV_NAME.toLowerCase() === "dev";
}

exports.isStage = function(){
    return ENV_NAME.toLowerCase() === "stage";
}

exports.isProd = function(){
    return ENV_NAME.toLowerCase() === "prod";
}

exports.getDocumentsBucket = function(){
    return DOCUMENTS_S3_BUCKET;
}

exports.getDocumentsPath = function(){
    return DOCUMENTS_PATH;
}

exports.getEnvName = function(){
    return ENV_NAME;
}

exports.getEmailFromName = function(){
    if ( this.isDev()){
        return "Dev OneRoost"
    }
    else if (this.isStage()){
        return "Stage OneRoost"
    }
    else{
        return "OneRoost Notifications"
    }
}

exports.getEnv = function(){
    if ( appEnv == null )
    {
        var props = {
            "applicationId": APP_ID
        };

        var json = JSON.stringify( props );
        props.json = {"env": json};
        appEnv = props;
    }

    return appEnv;
}
