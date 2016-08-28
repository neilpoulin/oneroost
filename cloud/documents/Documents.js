var AWS = require("aws-sdk");
AWS.config.region = "us-east-1";
var s3 = new AWS.S3({computeChecksums: true}); // this is the default setting

var envUtil = require("./../util/envUtil.js");
var ParseCloud = require("parse-cloud-express");
var Parse = ParseCloud.Parse;
Parse.serverURL = envUtil.serverURL;

exports.initialize = function(){
    registerPresignedUploadUrl();
    registerPresignedGetUrl();
}

function registerPresignedGetUrl(){
    console.log("Registering parse cloud getPresignedGetUrl");
    Parse.Cloud.define("getPresignedGetUrl", function(request, response) {
        var documentId = request.params.documentId;
        var user = request.user;

        var stakeholderQuery = new Parse.Query("Stakeholder")
        stakeholderQuery.equalTo("user", user);

        var docQuery = new Parse.Query("Document");
        docQuery.matchesKeyInQuery("deal", "deal", stakeholderQuery);
        docQuery.get( documentId , {
            success: function( doc ){
                if ( !doc ){
                    console.log("no document was found matching the query");
                    response.error({message: "the docuemnt was not found for the user and document ID."})
                    return;
                }
                var deal = doc.get("deal");
                var s3Key = doc.get("s3key");

                var params = {Bucket: envUtil.getDocumentsBucket(), Key: s3Key};
                var url = s3.getSignedUrl("getObject", params);

                console.log("successfully found document.");
                response.success({
                    message: "retrieved the document!",
                    url: url
                });
            },
            error: function(error){
                console.log("somethign failed when fetching the document", error);
            }
        });
    });
}


function registerPresignedUploadUrl(){
    console.log("Registering parse cloud getPresignedUploadUrl");
    Parse.Cloud.define("getPresignedUploadUrl", function(request, response) {
        var dealId = request.params.dealId;
        var fileName = request.params.fileName;
        var s3Key = getS3Key(dealId, fileName);

        var params = {Bucket: envUtil.getDocumentsBucket(), Key: s3Key};
        var url = s3.getSignedUrl("putObject", params);
        console.log("the signed url is", url);
        response.success({
            url: url,
            key: s3Key,
            fileName: fileName
        });
    });
}
function getS3Key( roostId, fileName ){
    return envUtil.getDocumentsPath() + "/roosts/" + roostId + "/" + fileName;
}
