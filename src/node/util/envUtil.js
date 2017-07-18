var TemplateUtil = require("./TemplateUtil")
var version = require("./../version.json")
var appEnv = null;

var APP_ID = process.env.PARSE_APP_ID || "TFy4TyyJJGpG7gnOUWzOZNtMcCkqQlYTfa4mJWQq";
var MASTER_KEY = process.env.PARSE_MASTER_KEY || "RQ50598LZUsDXzgnz6HgnGSwlCuv6XrZ3h7Li13P";
var DATABASE_URL = process.env.DATABASE_URL || "mongodb://localhost:27017/oneroost-db";
var PARSE_MOUNT = process.env.PARSE_MOUNT || "/parse";
var PARSE_PORT = process.env.PARSE_PORT || 8081;
var AWS_ID = process.env.AWS_ID || "AKIAIJI2VKVQPR4V4JYA";
var AWS_SECRET_ID = process.env.AWS_SECRET_ID || "HYS3LqjQV/0Ej6COtVAow7M0xhe6GV3h7fWPkR9K";
var SERVER_URL = process.env.PARSE_SERVER_URL || "http://localhost"
var HOSTNAME = process.env.HOSTNAME || "https://dev.oneroost.com"
var ENV_NAME = process.env.ENV_NAME || "dev"
var DOCUMENTS_S3_BUCKET = "oneroost-documents";
var DOCUMENTS_PATH = "documents"
var GA_TRACKING_ID = process.env.GA_TRACKING_ID || "UA-87950724-3"
var STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "SK_NOT_DEFINED"
var STRIPE_PUBLISH_KEY = process.env.STRIPE_PUBLISH_KEY || "PK_NOT_DEFINED"
var INTERCOM_APP_ID = process.env.INTERCOM_APP_ID || "lkx95sfl"
var INTERCOM_SECRET_KEY = process.env.INTERCOM_SECRET_KEY
var PUBLIC_SERVER_URL = HOSTNAME + PARSE_MOUNT;
var LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID || "78v10otstxnu8h"
var LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET || "not set"
var GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "298915058255-27b27sbb83fpe105kj12ccv0hc7380es.apps.googleusercontent.com"
if (SERVER_URL.trim().indexOf("http:") != 0){
    if (SERVER_URL.indexOf("//") != 0) {
        SERVER_URL = "//" + SERVER_URL;
    }
    SERVER_URL = "http:" + SERVER_URL;
}

if (SERVER_URL.indexOf("localhost") != -1){
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
console.log("PUBLIC_SERVER_URL:" + PUBLIC_SERVER_URL);
console.log("ENV_NAME: " + ENV_NAME);
console.log("HOSTNAME: " + HOSTNAME);
console.log("node title: ", process.title);
console.log("GA Tracking ID", GA_TRACKING_ID);
console.log("STRIPE_SECRET_KEY: ", "******")
console.log("STRIPE_PUBLISH_KEY: ", STRIPE_PUBLISH_KEY)
console.log("INTERCOM_APP_ID: ", INTERCOM_SECRET_KEY)
console.log("INTERCOM_SECRET_KEY: ", INTERCOM_SECRET_KEY ? "******" : "NOT SET")
console.log("LINKEDIN_CLIENT_ID: ", LINKEDIN_CLIENT_ID)
console.log("LINKEDIN_CLIENT_SECRET: ", LINKEDIN_CLIENT_SECRET ? "******" : "NOT SET")
console.log("GIT_HASH", version.hash)
console.log("GIT_TAG", version.version)

exports.getParseServerUrl = function(){
    return SERVER_URL;
}

exports.getPublicServerUrl = function(){
    return PUBLIC_SERVER_URL;
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
    return ENV_NAME.toLowerCase().indexOf("stage") != -1;
}

exports.isProd = function(){
    return ENV_NAME.toLowerCase().indexOf("prod") != -1;
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
exports.getGaTrackingId = function(){
    return GA_TRACKING_ID;
}

exports.getStripeSecretKey = function(){
    return STRIPE_SECRET_KEY;
}

exports.getStripePublishKey = function(){
    return STRIPE_PUBLISH_KEY;
}

exports.getEmailFromName = function(){
    if (this.isDev()){
        return "Dev OneRoost"
    }
    else if (this.isStage()){
        return "Stage OneRoost"
    }
    else{
        return "OneRoost Notifications"
    }
}

exports.getVersion = function(){
    return version;
}

exports.getIntercomAppId = function(){
    return INTERCOM_APP_ID
}

exports.getIntercomSecretKey = function(){
    return INTERCOM_SECRET_KEY
}

exports.LINKEDIN_CLIENT_ID = LINKEDIN_CLIENT_ID;
exports.LINKEDIN_CLIENT_SECRET = LINKEDIN_CLIENT_SECRET;
exports.GOOGLE_CLIENT_ID = GOOGLE_CLIENT_ID;
exports.getEnv = function(){
    if (appEnv == null) {
        var props = {
            "applicationId": APP_ID,
            "gaTrackingId": GA_TRACKING_ID,
            "emailTemplates": TemplateUtil.getTemplateNames(),
            "environment": ENV_NAME,
            "stripePublishKey": STRIPE_PUBLISH_KEY,
            "intercomAppId": INTERCOM_APP_ID,
            "version": version,
            "linkedinClientId": LINKEDIN_CLIENT_ID
        };

        var json = JSON.stringify(props);
        props.json = {"env": json};
        appEnv = props;
    }

    return appEnv;
}

exports.getEmailVerifiedPageUrl = function(){
    return HOSTNAME + "/verify-email-success"
}
