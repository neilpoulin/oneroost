var uuid = require("uuid");
var AWS = require("aws-sdk");
AWS.config.region = "us-east-1";
var s3 = new AWS.S3({computeChecksums: true, signatureVersion: "v4"}); // this is the default setting

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
            useMasterKey: true,
            success: function( doc ){
                if ( !doc ){
                    console.log("no document was found matching the query");
                    response.error({message: "the docuemnt was not found for the user and document ID."})
                }
                var s3Key = doc.get("s3key");
                var fileName = doc.get("fileName");
                var fileExtension = doc.get("fileExtension");
                let disposition = "attachment"
                if (fileName){
                    disposition += `; filename=${fileName}.${fileExtension}`
                }

                var params = {
                    Bucket: envUtil.getDocumentsBucket(),
                    Key: s3Key,
                    ResponseContentDisposition: disposition
                };
                var url = s3.getSignedUrl("getObject", params);

                console.log("successfully found document.");
                response.success({
                    message: "retrieved the document!",
                    url: url
                });
            },
            error: function(error){
                console.log("somethign failed when fetching the document", error);
                response.error({error: error});
            }
        });
    });
}

exports.getS3Object = async function( s3Key ){
    var bucket = envUtil.getDocumentsBucket();
    var params = {
        Bucket: bucket,
        Key: s3Key
    };
    return new Promise(function( resolve, reject){
        s3.getObject( params, function(err, data){
            if ( err ){
                console.error(err)
                reject(err);
            }else {
                resolve(data);
            }
        });
    });
}

function registerPresignedUploadUrl(){
    console.log("Registering parse cloud getPresignedUploadUrl");
    Parse.Cloud.define("getPresignedUploadUrl", function(request, response) {
        var dealId = request.params.dealId;
        var fileName = request.params.fileName;
        var bucket = envUtil.getDocumentsBucket();
        var type = request.params.type;
        console.log("dealId=", dealId, "filename=", fileName);

        var s3Key = getS3Key(dealId, fileName);
        var bucket = envUtil.getDocumentsBucket();
        var params = {
            Bucket: bucket,
            Key: s3Key,
            ContentType: type
        };

        console.log("generating s3 key with params:", params);
        var url = s3.getSignedUrl("putObject", params);

        console.log("created signed url: ", url);
        response.success({
            url: url,
            key: s3Key,
            bucket: bucket,
            fileName: fileName
        });
    });
}
function getS3Key( roostId, fileName ){
    return envUtil.getDocumentsPath() + "/roosts/" + roostId + "/" + uuid.v4() + "/" + fileName;
}
