var ParseCloud = require("parse-cloud-express");
var moment = require("moment");
var Parse = ParseCloud.Parse;
var EmailSender = require("./../EmailSender.js");
var envUtil = require("./../util/envUtil.js");

async function processReadyRoostRequest(currentUser, params, response){
    try{
        console.log("Setting up ready roost");
        var {profileUserId, roostName} = params
        console.log("Setting up Ready Roost for currentUser=" + currentUser.id + " and profilelUser=" + profileUserId);
        let profileUser = await (new Parse.Query("User")).get(profileUserId);


        var roostQuery = new Parse.Query("Deal");
        roostQuery.equalTo("createdBy", currentUser);
        roostQuery.equalTo("readyRoostUser", profileUser);
        let roosts = await roostQuery.find();

        console.log("query returned for finding existing ready roosts", roosts);
        var maxReadyRoosts = getMaxReadyRoostsPerUser();
        if ( roosts.length >= maxReadyRoosts ){
            //max limit reached, log and return error
            console.warn("max number of ready roosts reached for user ", currentUser );
            response.error({
                "message": "Max number of ready roosts hit for user",
                "link": "/roosts/" + roosts[0].id,
                "max_ready_roosts": maxReadyRoosts
            });
            return;
        }
        else {
            console.log("did not max out roosts, creating new ready roost");
            //get user's account if it exists, else create one

            var account = profileUser.get("account")
            var company = profileUser.get("company")

            if ( !account ){
                let accountName = company || (profileUser.get("firstName") + " " + profileUser.get("lastName")).trim() + "\'s Company"
                console.log("no account existed, creating one", accountName);
                account = await (new Parse.Object("Account", {accountName: accountName})).save()
            }
            console.log("creating roost")
            let roost = new Parse.Object("Deal", {
                createdBy: currentUser,
                readyRoostUser: profileUser,
                account: account,
                dealName: roostName,
                profile: {"timeline":"2016-05-13T00:00:00-06:00"},
                budget: {"low":0,"high":0}
            });
            let savedRoost = await roost.save()
            console.log("successfully saved the ready roost");
            //TODO: don't pass in the response here
            setupRoost(savedRoost, currentUser, profileUser, response);
        }
    }
    catch(e){
        console.error("Something went wrong setting up the ready roost", e);
        response.error({error: "Something went wrong setting up the ready roost", params: params});
    }
}

function setupRoost(roost, currentUser, profileUser, response){
    console.log("attempting to set up roost....");
    var toSave = [
        //deal comment
        new Parse.Object("DealComment", {
            message: getReadyRoostMessage(currentUser, roost.get("dealName")),
            author: null,
            deal: roost,
            onboarding: true
        }),
        //TODO: I have an issue with how next steps are being set up - troubleshoot this!
        //next steps
        new Parse.Object("NextStep", {
            dueDate: moment().toDate(),
            deal: roost,
            title: "Add the Product/Service",
            assignedUser: currentUser,
            createdBy: currentUser,
            description: "Time to present your offering!  Click into the \"Investment\" section to add a high-level overview of your product and/or service.  In addition to the overview, we recommend submitting the typical budget range your offering requires.",
            onboarding: true
        }),
        //second step -- documents
        new Parse.Object("NextStep", {
            dueDate: moment().add(1, "day").toDate(),
            deal: roost,
            title: "Share Relevant Materials",
            assignedUser: currentUser,
            createdBy: currentUser,
            description: "You've spent hours creating sales decks, one-pagers, case studies, and ROI calculators...now it is time to show that hard work off!\n\nClick into the \"Documents\" section to add Power Point presentations, Excel spreadsheets, PDFs, and Word documents.",
            onboarding: true
        }),
        //third step participants
        new Parse.Object("NextStep", {
            dueDate: moment().add(2, "day").toDate(),
            deal: roost,
            title: "Invite Colleagues",
            assignedUser: currentUser,
            createdBy: currentUser,
            description: "On average, B2B deals involve over 5 different stakeholders to make a decision on an opportunity.  To get everyone on the same page (literally!), invite your colleagues to this Roost by clicking into the \"Participants\" section and inputting their email address.  We will take it from there and send them an invitation to join the Roost! ",
            onboarding: true
        }),
        //fourth step - buyer reviewing
        new Parse.Object("NextStep", {
            dueDate: moment().add(3, "days").toDate(),
            deal: roost,
            title: "Submit Opportunity for Review!",
            assignedUser: currentUser,
            createdBy: currentUser,
            description: "Congrats!  You've made it to the final next step before submitting the opportunity to the Buyer.  If you're on this next step, the following should have been submitted to the Roost: The offering overview, budget requirements, relevant materials, and your colleagues' information." +
            "\n\nAssuming everything is completed,  click into the \"Participants\" section and submit the opportunity, which is located under the Buyer's name.  After you click submit, OneRoost will send an email to the Buyer notifying the Roost (opportunity) is ready for review.  ",
            onboarding: true
        }),
        // add participants
        new Parse.Object("Stakeholder", {
            deal: roost,
            user: currentUser,
            inviteAccepted: true,
            invitedBy: null,
            role: "CREATOR",
            onboarding: true
        }),
        new Parse.Object("Stakeholder", {
            deal: roost,
            user: profileUser,
            inviteAccepted: false,
            invitedBy: currentUser,
            readyRoostApprover: true,
            role: "SELLER",
            onboarding: true
        }),
        new Parse.Object("Document", {
            createdBy: profileUser,
            deal: roost,
            fileName: "FAQ - OneRoost",
            s3key: "documents/public/FAQ - OneRoost.docx",
            type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            size: 123046,
            onboarding: true
        })
    ];
    console.log("set up all objects...atempting to save", toSave);
    Parse.Object.saveAll(toSave, {
        success: function(list) {
            console.log("SUCCESS for all!")
            response.success({roost: roost});
        },
        error: function(error){
            console.error("ERROR SAVING ALL")
            response.error("Faild to save objects", error);
        }
    });
}

function getReadyRoostMessage(createdByUser, roostName){
    return "Hi " + createdByUser.get("firstName") + " " + createdByUser.get("lastName") + ",\n\n" +
    "Congratulations on creating the " + roostName + " Roost! OneRoost is a tool to get buyers and sellers on the same page by aggregating all the different elements of an opportunity: Product/service details, documents, next steps, participants, and investment requirements." +
    "\n\nWe know this is a new experience for many sellers, so we've already created a few next steps to get you started (see above). If you have any questions about how to use OneRoost or best practices, check out the Frequently Asked Questions by clicking \"Documents\" above. Still need help after reviewing the FAQs, feel free to send us a note at help@oneroost.com" +
    "\n\nGood luck and happy Roosting!" +
    "\n\nThe OneRoost Team"
}

function getMaxReadyRoostsPerUser(){
    return 1
}

async function processReadyRoostSubmission(currentUser, params, response){
    //dealId, stakeholderId
    try{
        var stakeholderQuery = new Parse.Query("Stakeholder");
        stakeholderQuery.include("deal.readyRoostUser");

        let stakeholder = await stakeholderQuery.get(params.stakeholderId)

        console.log("retrieved stakeholder", stakeholder);
        var deal = stakeholder.get("deal");

        var documentQuery = new Parse.Query("Document");
        let documentQueryResult = documentQuery.equalTo("deal", deal).find();

        let nextStepsQuery = new Parse.Query("NextStep");
        nextStepsQuery.equalTo("deal", deal);
        let nextStepsQueryResult = nextStepsQuery.find();

        let documents = await documentQueryResult;
        let nextSteps = await nextStepsQueryResult;

        var roostUser = deal.get("readyRoostUser");
        var roostUserAddress = {
            email: roostUser.get("email"),
            name: roostUser.get("firstName") + " " + roostUser.get("lastName")
        };
        var dealLink = envUtil.getHost() + "/roosts/" + deal.id;
        let reviewLink = envUtil.getHost() + "/review/" + stakeholder.id;
        var documentsJson = documents.map(function(doc){
            return {
                fileName: doc.get("fileName"),
                type: doc.get("type")
            }
        }).filter(function(doc){
            return doc.fileName.trim() != "FAQ - OneRoost"
        })

        let completedStepsJson = nextSteps.filter(step => step.get("completedDate") != null).map(step => step.toJSON());

        var email = {
            deal: deal.toJSON(),
            roostUser: roostUser.toJSON(),
            currentUser: currentUser.toJSON(),
            documents: documentsJson,
            dealLink: dealLink,
            reviewLink: reviewLink,
            completedSteps: completedStepsJson,
            messageId: deal.id
        }
        console.log(email);
        EmailSender.sendTemplate( "readyRoostSubmittedNotif", email, [roostUserAddress] );

        response.success({"message": "submitted the roost!"});
    }
    catch(e){
        console.error("failed to process ready roost sumission", e);
        return response.error({error: e});
    }
}

exports.initialize = function(){
    Parse.Cloud.define("createReadyRoost", function(request, response) {
        var currentUser = request.user;
        processReadyRoostRequest( currentUser, request.params, response )
    });

    Parse.Cloud.define("submitReadyRoost", function(request, response){
        console.log("submitting ready roost");
        var currentUser = request.user;
        processReadyRoostSubmission(currentUser, request.params, response);
    });
}
