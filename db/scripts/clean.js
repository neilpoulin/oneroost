var deleteUserCount = 0;
var deleteAccountCount = 0;
var deletedSeatsCount = 0;
var deletedStakeholdersCount = 0
var deletedDealsCount = 0;
var deletedCommentsCount = 0;
var deletedRequirementsCount = 0;
var deletedNextStepsCount = 0;
var deletedTemplatesCount = 0;
var deletedDocumentsCount = 0;
var deletedSessionsCount = 0;
var dryRun = false
main()

function main(){
    printjson(db.getCollectionNames())
    cleanUsers()
    cleanAccounts()
    cleanSeats()
    cleanStakeholders()
    cleanDeals()
    cleanTemplates()
    cleanDocuments()
    cleanRequirements()
    cleanComments()
    cleanNextSteps()
    cleanSession()
    print("DRY RUN: " + dryRun)
    print(`Deleted ${deleteUserCount} Users`)
    print(`Deleted ${deleteAccountCount} Accounts`)
    print (`Deleted ${deletedSeatsCount} Seats`)
    print (`Deleted ${deletedStakeholdersCount} Stakeholders`)
    print (`Deleted ${deletedDealsCount} Deals`)
    print (`Deleted ${deletedCommentsCount} Comments`)
    print (`Deleted ${deletedRequirementsCount} Requirements`)
    print (`Deleted ${deletedNextStepsCount} NextSteps`)
    print (`Deleted ${deletedTemplatesCount} Templates`)
    print (`Deleted ${deletedDocumentsCount} Documents`)
    print(`Deleted ${deletedSessionsCount} Sessions`)
}

function getPointerId(obj, name){
    return obj[`_p_${name}`] ? obj[`_p_${name}`].split("$")[1] : null
}

function getDealId(obj){
    return getPointerId(obj, "deal");
}

function cleanSession(){
    db.getCollection("_Session").find().forEach(session => {
        print("")
        print("============")
        print(`Session = ${session._id}`)
        var userId = getPointerId(session, "user")
        var user = findUserById(userId)
        if (!user){
            deleteSession(session)
        }
    })
}

function cleanNextSteps(){
    db.getCollection("NextStep").find().forEach(step => {
        print("")
        print("============")
        print(`NexstStep = ${step._id}`)
        var dealId = getDealId(step)
        var deal = findDealById(dealId)
        if (!deal){
            deleteNextStep(step)
        }
    })
}

function cleanTemplates(){
    db.getCollection("Template").find().forEach(template => {
        print("")
        print("============")
        print(`Template = ${template._id}`)
        var accountId = getPointerId(template, "account")
        var account = findAccountById(accountId)
        if (!account){
            deleteTemplate(template)
        }
        print("-----------")
    })
}

function cleanDocuments(){
    db.getCollection("Document").find().forEach(doc => {
        print("")
        print("============")
        print(`Document = ${doc._id}`)
        var dealId = getDealId(doc)
        var deal = findDealById(dealId)
        if (!deal){
            deleteDocument(doc)
        }
    })
}

function cleanComments(){
    db.getCollection("DealComment").find().forEach(comment => {
        print("")
        print("============")
        print(`Comment = ${comment._id}`)
        var dealId = getDealId(comment)
        var deal = findDealById(dealId)
        if (!deal){
            deleteComment(comment)
        }
    })
}

function cleanRequirements(){
    db.getCollection("Requirement").find().forEach(req => {
        print("")
        print("============")
        print(`Requirement = ${req._id}`)
        var dealId = getDealId(req)
        var deal = findDealById(dealId)
        if (!deal){
            deleteRequirement(req)
        }
    })
}

function cleanDeals(){
    db.getCollection("Deal").find().forEach(deal => {
        print("")
        print("============")
        print(`Deal = ${deal._id}`)
        var stakeholderCount = getStakeholderCountForDealId(deal._id);
        var templateId = getPointerId(deal, "template")
        var template = findTemplateById(templateId)
        print("Deal has " + stakeholderCount + " stakeholders")
        if (stakeholderCount === 0 || !template){
            deleteDeal(deal)
            deleteCommentsForDealId(deal._id)
            deleteStakeholdersForDeal(deal)
            deleteDocumentsForDeal(deal)
        }
        print("-----------")
    })
}

function cleanStakeholders(){
    db.getCollection("Stakeholder").find().forEach(stakeholder => {
        print("")
        print("============")
        print(`StakeholderId = ${stakeholder._id}`)
        var userId = stakeholder._p_user ? stakeholder._p_user.split("$")[1] : null
        var dealId = stakeholder._p_deal ? stakeholder._p_deal.split("$")[1] : null
        var invitedByUserId = getPointerId(stakeholder, "invitedBy")
        var user = findUserById(userId)
        var invitedBy = findUserById(invitedByUserId)
        var deal = findDealById(dealId)
        if (!user || !deal){
            deleteStakeholder(stakeholder);
        }
        else if (invitedByUserId && !invitedBy){
            deleteStakeholder(stakeholder);
        }
        print("-----------")
    })
}

function cleanSeats(){
    db.getCollection("AccountSeat").find().forEach(seat => {
        print("")
        print("============")
        print(`SeatID = ${seat._id}`)
        var userId = seat._p_user ? seat._p_user.split("$")[1] : null
        var accountId = seat._p_account ? seat._p_account.split("$")[1] : null
        if (!userId && !accountId){
            deleteSeat(seat)
        }
        else if (!findAccountById(accountId)) {
            deleteSeat(seat)
        }
        else if (userId && !findUserById(userId)){
            deleteSeat(seat)
        }
        print("-----------")
    })
}

function cleanUsers(){
    db.getCollection("_User").find().forEach((user) => {
        print("")
        print("============")
        print(`UserID = ${user._id}`)
        cleanUser(user)
        print("-----------")
    })
}

function cleanAccounts(){
    db.getCollection("Account").find().forEach(account => {
        print("")
        print("============")
        print(`AccountID = ${account._id}`)
        cleanAccount(account)
        print("-----------")
    })
}

function cleanAccount(account){
    var userCount = findUsersByAccountId(account._id)
    print(`# Users: ${userCount}`)
    if (userCount === 0){
        deleteAccount(account)
    }
}

function cleanUser(user){
    var accountId = user._p_account ? user._p_account.split("$")[1] : null;
    var account = findAccountById(accountId)

    if (account){
        print("found account!")
        return
    }
    else {
        print ("No account")
        return deleteUser(user);
    }
}

function deleteUser(user){
    if (!dryRun){
        db.getCollection("_User").deleteOne({_id: user._id})
    }
    print("deleted user")
    deleteUserCount = deleteUserCount + 1;
}

function findUsersByAccountId(accountId){
    if (!accountId){
        return 0
    }
    return db.getCollection("_User").count({
        "_p_account": `Account$${accountId}`
    })
}

function deleteSeat(seat){
    if (!dryRun){
        db.getCollection("AccountSeat").deleteOne({_id: seat._id})
    }
    print("Seat deleted")
    deletedSeatsCount++;
}

function deleteAccount(account){
    if(!dryRun){
        db.getCollection("Account").deleteOne({_id: account._id})
    }
    print("Account deleted")
    deleteAccountCount = deleteAccountCount + 1;
}

function deleteStakeholder(stakeholder){
    if(!dryRun){
        db.getCollection("Stakeholder").deleteOne({_id: stakeholder._id})
    }
    print("Stakeholder deleted")
    deletedStakeholdersCount++;
}

function deleteDeal(deal){
    if(!dryRun){
        db.getCollection("Deal").deleteOne({_id: deal._id})
    }
    print("Deal deleted")
    deletedDealsCount++;
}

function deleteDocument(doc){
    if(!dryRun){
        db.getCollection("Document").deleteOne({_id: doc._id})
    }
    print("Document deleted")
    deletedDocumentsCount++;
}

function deleteComment(comment){
    if(!dryRun){
        db.getCollection("Document").deleteOne({_id: comment._id})
    }
    print("Comment deleted")
    deletedCommentsCount++;
}

function deleteCommentsForDealId(dealId){
    var dealValue = `Deal$${dealId}`
    if (!dealId){
        return
    }
    if(!dryRun){
        try{
            var result = db.getCollection("DealComment").deleteMany({"_p_deal": dealValue})
            deletedCommentsCount += result.deletedCount;
            print("deleted " + result.deletedCount + "comments")
        }
        catch (e){
            print(e)
        }
    }
}

function deleteDocumentsForDeal(deal){
    var dealValue = `Deal$${deal._id}`
    if(!dryRun){
        var result = db.getCollection("Document").deleteMany({"_p_deal": dealValue})
        deletedDocumentsCount += result.deletedCount;
        print("deleted " + result.deletedCount + "documents")
    }
}

function deleteTemplate(template){
    if(!dryRun){
        db.getCollection("Template").deleteOne({_id: template._id})
    }
    deletedTemplatesCount++;
}

function deleteRequirement(requirement){
    if(!dryRun){
        db.getCollection("Requirement").deleteOne({_id: requirement._id})
    }
    deletedRequirementsCount++;
}

function deleteStakeholdersForDeal(deal){
    var dealValue = `Deal$${deal._id}`
    if(!dryRun){
        var result = db.getCollection("Stakeholder").deleteMany({"_p_deal": dealValue})
        deletedStakeholdersCount += result.deletedCount;
        print("deleted " + result.deletedCount + "stakeholders")
    }
}
function deleteNextStep(step){
    if(!dryRun){
        db.getCollection("NextStep").deleteOne({_id: step._id})
    }
    deletedNextStepsCount++;
}

function deleteSession(session){
    if(!dryRun){
        db.getCollection("_Session").deleteOne({_id: session._id })
    }
    deletedSessionsCount++;
}

function deleteNextStepsForDealId(dealId){
    var dealValue = `Deal$${dealId}`
    if(!dryRun){
        var result = db.getCollection("NextStep").deleteMany({"_p_deal": dealValue})
        deletedNextStepsCount += result.deletedCount;
        print("deleted " + result.deletedCount + "Next Steps")
    }
}

function findAccountById(accountId){
    if (accountId){
        return db.getCollection("Account").findOne({ _id: accountId });
    }
    return null;
}

function findDealById(dealId){
    if (dealId){
        return db.getCollection("Deal").findOne({_id: dealId})
    }
}

function findTemplateById(templateId){
    if (templateId){
        return db.getCollection("Template").findOne({_id: templateId})
    }
    return null
}

function findUserById(userId){
    if (userId){
        return db.getCollection("_User").findOne({_id: userId})
    }
    return null
}

function getStakeholderCountForDealId(dealId){
    if (!dealId){
        return 0
    }
    return db.getCollection("Stakeholder").count({
        "_p_deal": `Deal$${dealId}`
    })
}
