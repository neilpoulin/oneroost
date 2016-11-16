printjson(db.getCollectionNames())
// db.getCollection("_GlobalConfig").deleteMany({});

db.getCollection("_GlobalConfig").find().forEach(printjson)
var params = {
    params: {
        "notificationSettings": {"commentEmails":true,"nextStepEmails":true,"inviteEmails":true,"documentAddedEmails":true},
        "emailEnabled": true,
        "emailOverride": "neil@oneroost.com",
        "emailOverrideEnabled": true,
        "domain": "dev.oneroost.com",
        "maxReadyRoosts": 1
    }
};
var query = {"_id": 1}

db.getCollection("_GlobalConfig").update(query, params, {upsert: true});

// var result = db.Version.insert( params )
print("printing at end")
db.getCollection("_GlobalConfig").find().forEach(printjson)
