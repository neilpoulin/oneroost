var ParseCloud = require("parse-cloud-express");
var moment = require("moment");
var Parse = ParseCloud.Parse;

function processReadyRoostRequest(currentUser, params, response){
    console.log("Setting up ready roost");
    var {profileUserId, roostName} = params
    console.log("Setting up Ready Roost for currentUser=" + currentUser.id + " and profilelUser=" + profileUserId);

    (new Parse.Query("User")).get(profileUserId, {
        success: function(profileUser){
            var roostQuery = new Parse.Query("Deal");
            roostQuery.equalTo("createdBy", currentUser);
            roostQuery.equalTo("readyRoostUser", profileUser);
            roostQuery.find({
                success: function(roosts){
                    console.log("query returned for finding existing ready roosts", roosts);
                    var maxReadyRoosts = getMaxReadyRoostsPerUser();
                    if ( roosts.length >= maxReadyRoosts ){
                        //max limit reached, log and return error
                        console.warn("max number of ready roosts reached for user ", currentUser );
                        response.error({
                            "message": "Max number of ready roosts hit for user",
                            "max_ready_roosts": maxReadyRoosts
                        });
                        return;
                    }
                    else {
                        console.log("did not max out roosts, creating new ready roost");
                        //get user's account if it exists, else create one

                        var account = profileUser.get("account")
                        var companyName = profileUser.get("company")

                        var createRoost = function(account){
                            console.log("creating roost with new account")
                            var roost = new Parse.Object("Deal", {
                                createdBy: currentUser,
                                readyRoostUser: profileUser,
                                account: account,
                                dealName: roostName,
                                profile: {"timeline":"2016-05-13T00:00:00-06:00"},
                                budget: {"low":0,"high":0}
                            });
                            roost.save().then(function(roost){
                                console.log("successfully saved the ready roost");
                                setupRoost(roost, currentUser, profileUser, response);
                            }, function(error){
                                console.error("failed to save the ready roost", error);
                                response.error({"error": "failed to create ready roost"})
                            })
                        };

                        if ( !account )
                        {
                            new Parse.Object("Account", {
                                accountName: companyName || (profileUser.get("firstName") + " " + profileUser.get("lastName")).trim() + "\'s Company"
                            }).save().then(createRoost)
                        }
                        else {
                            createRoost(account)
                        }
                    }
                },
                error: function(error){
                    console.error(error)
                }
            })
        },
        error: function(error){
            console.error("Failed to find a Profile User with the id of = " + profileUserId);
        }
    });
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
            description: "Click the \"Investment\" box and add the product/service details as well as the cost ranges your offering requires."
        }),
        //second step -- documents
        new Parse.Object("NextStep", {
            dueDate: moment().add(1, "day").toDate(),
            deal: roost,
            title: "Share Documents",
            assignedUser: currentUser,
            description: "Click the \"Documents\" box and add any documents that help communicate the value of your offering.  These can be case studies, white papers, presentations, ROI calculators, and any other materials you feel like sharing. "
        }),
        //third step participants
        new Parse.Object("NextStep", {
            dueDate: moment().add(2, "day").toDate(),
            deal: roost,
            title: "Add Participants",
            assignedUser: currentUser,
            description: "Click the \"Participants\" box and add additional stakeholders from your team who you'd like to include.  Think of participants as anyone who can help move this opportunity forward.  "
        }),
        //fourth step - buyer reviewing
        new Parse.Object("NextStep", {
            dueDate: moment().add(3, "days").toDate(),
            deal: roost,
            title: "Buyer Review",
            assignedUser: currentUser,
            description: "Once you've completed all the previous Next Steps, create your own Next Step for the buyer.  We recommend the following: "
        }),
        // add participants
        new Parse.Object("Stakeholder", {
            deal: roost,
            user: currentUser,
            inviteAccepted: true,
            invitedBy: null,
            role: "CREATOR"
        }),
        new Parse.Object("Stakeholder", {
            deal: roost,
            user: profileUser,
            inviteAccepted: false,
            invitedBy: currentUser,
            readyRoostApprover: true,
            role: "SELLER"
        }),
        new Parse.Object("Document", {
            createdBy: profileUser,
            deal: roost,
            fileName: "FAQ - OneRoost",
            s3key: "documents/public/FAQ+-+OneRoost.docx",
            type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            size: 123046
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

function processReadyRoostSubmission(currentUser, params, response){

    response.success({"message": "submitted the roost!"});
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
