printjson(db.getCollectionNames())
// db.getCollection("_GlobalConfig").deleteMany({});

db.getCollection("_GlobalConfig").find().forEach(printjson)
var params = {
    params: {
        "notificationSettings": {"commentEmails": true, "nextStepEmails": true, "inviteEmails": true, "documentAddedEmails": true},
        "emailEnabled": true,
        "emailOverride": "neil@oneroost.com",
        "emailOverrideEnabled": true,
        "domain": "dev.oneroost.com",
        "maxReadyRoosts": 1,
        "readyRoostDocs": [{
            "displayName": "Frequently Asked Questions",
            "s3key": "documents/public/faq.pdf",
            "type": "application/pdf",
            "fileExtension": "pdf",
            "size": 50459
        }],
        "readyRoostSteps": [
            {
                "title": "Add the Product/Service",
                "description": "Time to present your offering!  Click into the \"Investment\" section to add a high-level overview of your product and/or service.  In addition to the overview, we recommend submitting the typical budget range your offering requires.",
                "offsetDays": 0
            },
            {
                "title": "Share Relevant Materials",
                "description": "You've spent hours creating sales decks, one-pagers, case studies, and ROI calculators...now it is time to show that hard work off!\n\nClick into the \"Documents\" section to add Power Point presentations, Excel spreadsheets, PDFs, and Word documents.",
                "offsetDays": 1
            },
            {
                "title": "Invite Colleagues",
                "description": "On average, B2B deals involve over 5 different stakeholders to make a decision on an opportunity.  To get everyone on the same page (literally!), invite your colleagues to this Roost by clicking into the \"Participants\" section and inputting their email address.  We will take it from there and send them an invitation to join the Roost! ",
                "offsetDays": 2
            },
            {
                "title": "Submit Opportunity for Review!",
                "description": "Congrats!  You've made it to the final next step before submitting the opportunity to the Buyer.  If you're on this next step, the following should have been submitted to the Roost: The offering overview, budget requirements, relevant materials, and your colleagues' information.\n\nAssuming everything is completed,  click into the \"Participants\" section and submit the opportunity, which is located under the Buyer's name.  After you click submit, OneRoost will send an email to the Buyer notifying the Roost (opportunity) is ready for review.  ",
                "offsetDays": 3
            }
        ],
        "faqs": [
            {
                "question": "What is OneRoost?",
                "answer": "OneRoost was created to get buyers and sellers on the same page (literally) to assess B2B opportunities."
            },
            {
                "question": "What is a Roost?",
                "answer": "A Roost is where a seller can present their offering in a thorough and straightforward manner. Think of a Roost as the opportunity’s headquarters, where a seller can do the following: start a conversation with the buyer, submit documents, create next steps, and invite the appropriate stakeholders."
            },
            {
                "question": "What is a Ready Roost?",
                "answer": "Ready Roost’s are preconfigured Roosts set up by the buyer who will review the opportunity."
            },
            {
                "question": "Who should be invited to a Roost in the “Participants” section?",
                "answer": "Anyone who needs to be involved in the decision process. There is no limit to how many participants you invite."
            },
            {
                "question": "Is there a limit on how many “Next Steps” I can create?",
                "answer": "Nope. But we recommend capping Next Steps at 5 to not overwhelm the buyer and to keep things moving. You can always add more Next Steps and all completed Next Steps are accessible by clicking the check mark."
            },
            {
                "question": "Do I really need to put the price of my offering in the “Investment” section?",
                "answer": ""
            },
            {
                "question": "We recommend you do but it is totally up to the seller.",
                "answer": ""
            },
            {
                "question": "How do you know which Opportunity Stage a particular Roost is currently in?",
                "answer": "Opportunity Exploration – Introductions, need assessments, offering overviews\nDiving into the Details – Evaluating offering/need fit, investment discussions, KPIs\nBusiness Approvals – Budget confirmation, decision maker approval, legal review"
            },
            {
                "question": "Can I create Opportunities (Roosts) for other companies?",
                "answer": "Yes! On the left side of every Roost, you have the ability to create an entirely new Opportunity (Roost) – this goes for buyers and sellers. All you need to do is click “+Create Opportunity” and input the client and Opportunity name."
            },
            {
                "question": "What kind of documents can I upload?",
                "answer": "Excel spreadsheets, Power Points, Word documents, PDFs, and PNGs."
            },
            {
                "question": "Are Roosts secure and hidden from the public?",
                "answer": "Yes! Only invited participants can see a Roost. All passwords are encrypted and the links are randomized."
            }
        ]
    }
};
var query = {"_id": 1}

db.getCollection("_GlobalConfig").update(query, params, {upsert: true});

// var result = db.Version.insert( params )
print("printing at end")
db.getCollection("_GlobalConfig").find().forEach(printjson)
