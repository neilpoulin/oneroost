var ParseCloud = require("parse-cloud-express");
var moment = require("moment");
var Parse = ParseCloud.Parse;
var EmailSender = require("./../EmailSender.js");
var envUtil = require("./../util/envUtil.js");

const DOCS_CONFIG_KEY = "readyRoostDocs";
const STEPS_CONFIG_KEY = "readyRoostSteps";

async function processReadyRoostRequest(currentUser, params, response){
    try{
        console.log("Setting up ready roost");
        var {profileUserId, roostName} = params
        console.log("Setting up Ready Roost for currentUser=" + currentUser.id + " and profilelUser=" + profileUserId);
        let profileUser = await (new Parse.Query("User")).get(profileUserId);

        var roostQuery = new Parse.Query("Deal");
        roostQuery.equalTo("createdBy", currentUser);
        roostQuery.equalTo("readyRoostUser", profileUser);
        let roosts = await roostQuery.find({useMasterKey: true});

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
            await setupRoost(savedRoost, currentUser, profileUser, response);
        }
    }
    catch(e){
        console.error("Something went wrong setting up the ready roost", e);
        response.error({error: "Something went wrong setting up the ready roost", params: params});
    }
}

async function setupRoost(roost, currentUser, profileUser, response){
    console.log("attempting to set up roost....");
    let config = await Parse.Config.get();
    let requirementTemplate = null
    try{
        let requirementTemplateQuery = new Parse.Query("RequirementTemplate")
        requirementTemplateQuery.equalTo("user", profileUser)
        let templateResult = await requirementTemplateQuery.find({useMasterKey: true});
        if ( templateResult ){
            requirementTemplate = templateResult[0]
            console.log("FOUND REQUIREMENTS: ", requirementTemplate.toJSON())
        }

    }catch(e){
        console.log("no requirement template found for user " + profileUser.id)
    }

    let requirements = createRequirements(profileUser, roost, requirementTemplate, config);
    let comments = createComments(currentUser, roost, config);
    let docs = createDocs(profileUser, roost, config);
    let steps = createNextSteps(currentUser, roost, config);
    let stakeholders = createStakeholders(currentUser, profileUser, roost);

    console.log("finished setting up ready roost items");
    let toSave = [].concat(comments, steps, docs, stakeholders, requirements);

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

function createRequirements(profileUser, roost, requirementTemplate, config){
    if ( !requirementTemplate ){
        return []
    }
    console.log("requirementTemplate = ", requirementTemplate.toJSON())
    let requirements = requirementTemplate.get("requirements").map(req => {
        return new Parse.Object("Requirement", {
            deal: roost,
            onboarding: true,
            createdBy: profileUser,
            modifiedBy: profileUser,
            title: req.title,
            description: req.description,
            active: true,
        })
    })
    console.log("requirements to create", requirements);
    return requirements;
}

function createComments(currentUser, roost, config){
    return [
        //deal comment
        new Parse.Object("DealComment", {
            message: getReadyRoostMessage(currentUser, roost.get("dealName")),
            author: null,
            deal: roost,
            onboarding: true
        })
    ];
}

function createStakeholders(currentUser, profileUser, roost){
    return [
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
        })
    ];
}

function createNextSteps(currentUser, roost, config){
    let toCreate = config.get(STEPS_CONFIG_KEY);
    let steps = toCreate.map((step) =>{
        return new Parse.Object("NextStep", {
            dueDate: moment().add(step.offsetDays, "day").toDate(),
            deal: roost,
            title: step.title,
            assignedUser: currentUser,
            createdBy: currentUser,
            description: step.description,
            onboarding: true
        })
    })
    return steps;
}

function createDocs(createdBy, roost, config){
    let toCreate = config.get(DOCS_CONFIG_KEY);
    let docs = toCreate.map((doc) => {
        return new Parse.Object("Document", {
            createdBy: createdBy,
            deal: roost,
            fileName: doc.displayName,
            s3key: doc.s3key,
            type: doc.type,
            size: doc.size,
            fileExtension: doc.fileExtension,
            onboarding: true
        })
    });
    return docs;
}

function getReadyRoostMessage(createdByUser, roostName){
    let fullName = createdByUser.get("firstName") + " " + createdByUser.get("lastName");
    let company = createdByUser.get("company");
    return `Hi ${fullName},` +
    "\n" +
    `Congratulations on creating a Roost for ${fullName} at ${company}! OneRoost is a tool to get buyers and sellers on the same page by aggregating all the different elements of an opportunity: Product/service details, documents, next steps, participants, and investment requirements.` +
    "\n\n" +
    "We know this is a new experience for many sellers, so we've already created a few next steps to get you started (see above). If you have any questions about how to use OneRoost or best practices, check out the Frequently Asked Questions by clicking \"Documents\" above. Still need help after reviewing the FAQs, feel free to send us a note at help@oneroost.com" +
    "\n\n" +
    "Good luck and happy Roosting!" +
    "\n" +
    "The OneRoost Team"
}

function getMaxReadyRoostsPerUser(){
    return 1
}

async function processReadyRoostSubmission(currentUser, params, response){
    //dealId, stakeholderId
    try{
        var stakeholderQuery = new Parse.Query("Stakeholder");
        stakeholderQuery.include("deal.readyRoostUser");

        let stakeholder = await stakeholderQuery.get(params.stakeholderId, {useMasterKey: true})

        console.log("retrieved stakeholder", stakeholder);
        var deal = stakeholder.get("deal");

        var documentQuery = new Parse.Query("Document");
        let documentQueryResult = documentQuery.equalTo("deal", deal).find();

        let nextStepsQuery = new Parse.Query("NextStep");
        nextStepsQuery.equalTo("deal", deal);
        let nextStepsQueryResult = nextStepsQuery.find({useMasterKey: true});

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
