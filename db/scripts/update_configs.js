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
        "maxReadyRoosts": 1,
        "readyRoostDocs": [{
            "displayName": "Frequently Asked Questions",
            "s3key":"documents/public/faq.pdf",
            "type":"application/pdf",
            "fileExtension": "pdf",
            "size":50459
        }],
        "readyRoostSteps": [
            {
                "title"	: "Add the Product/Service",
                "description": "Time to present your offering!  Click into the \"Investment\" section to add a high-level overview of your product and/or service.  In addition to the overview, we recommend submitting the typical budget range your offering requires.",
                "offsetDays": 0
            },
            {
                "title"	: "Share Relevant Materials",
                "description": "You've spent hours creating sales decks, one-pagers, case studies, and ROI calculators...now it is time to show that hard work off!\n\nClick into the \"Documents\" section to add Power Point presentations, Excel spreadsheets, PDFs, and Word documents.",
                "offsetDays": 1
            },
            {
                "title"	: "Invite Colleagues",
                "description": "On average, B2B deals involve over 5 different stakeholders to make a decision on an opportunity.  To get everyone on the same page (literally!), invite your colleagues to this Roost by clicking into the \"Participants\" section and inputting their email address.  We will take it from there and send them an invitation to join the Roost! ",
                "offsetDays": 2
            },
            {
                "title"	: "Submit Opportunity for Review!",
                "description": "Congrats!  You've made it to the final next step before submitting the opportunity to the Buyer.  If you're on this next step, the following should have been submitted to the Roost: The offering overview, budget requirements, relevant materials, and your colleagues' information.\n\nAssuming everything is completed,  click into the \"Participants\" section and submit the opportunity, which is located under the Buyer's name.  After you click submit, OneRoost will send an email to the Buyer notifying the Roost (opportunity) is ready for review.  ",
                "offsetDays": 3
            }
        ]
    }
};
var query = {"_id": 1}

db.getCollection("_GlobalConfig").update(query, params, {upsert: true});

// var result = db.Version.insert( params )
print("printing at end")
db.getCollection("_GlobalConfig").find().forEach(printjson)
