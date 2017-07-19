import envUtil from "./../util/envUtil.js"
import * as stripe from "./../payment/Stripe"
var ParseCloud = require("parse-cloud-express");
import Raven from "raven"
var Parse = ParseCloud.Parse;
Parse.serverURL = envUtil.serverURL;

const ROLES = {
    USER: "USER",
    PARTICIPANT: "PARTICIPANT",
    ADMIN: "ADMIN",
    OWNER: "OWNER"
}

const createSeat = async (user, account, roles) => {
    try{
        let AccountSeat = Parse.Object.extend("AccountSeat")
        let seat = new AccountSeat({
            user,
            account,
            roles: roles,
            active: true,
        })
        return seat.save()
    }
    catch (e){
        console.error("Failed to create an AccountSeat", e)
        Raven.captureException(e)
    }
}

const createAccount = async (user, domain) => {
    try{
        let Account = Parse.Object.extend("Account")
        let account = new Account({
            emailDomain: domain.toLowerCase(),
            accountName: user.get("company") || domain,
            createdBy: user,
        })
        account = await account.save()
        await createSeat(user, account, [ROLES.OWNER])
        return account
    }
    catch(e){
        console.error("Failed to create a new account", e)
        Raven.captureException(e)
    }
}

const initialize = () => {
    console.log("Initializing Subscriptions")

    Parse.Cloud.define("createCustomer", async (request, response) => {
        try{
            const user = request.user
            const {plan} = request.params

            let customerId = await stripe.createCustomer(user)
            console.log("customer created!!!", customerId)

            console.log("plan:", plan);
            return response.success({
                "success": "Created a plan!",
                customerId,
            })
        }
        catch(e){
            console.error("Failed to execute createCustomer function", e);
            response.error({message: "something went wrong", error: e });
            Raven.captureException(e)
        }
    })

    Parse.Cloud.define("createSubscription", async (request, response) => {
        try{
            const {planId, stripeToken} = request.params
            const user = request.user
            let subscription = await stripe.createSubscription(user, planId, stripeToken)
            return response.success({
                success: true,
                subscriptionId: subscription.id,
                subscription,
                planId,
                customerId: subscription.customer,
                message: "Successfully created the subscription"
            });
        }
        catch(e){
            console.error("Failed to create subscription", e)
            Raven.captureException(e)
            return response.error({
                success: false,
                error: e,
                message: "Something unexpected went wrong while creating the subscription"})
        }
    })

    Parse.Cloud.define("addUserToAccount", async (request, response) => {
        try{
            let user = request.user
            const {userId, email} = request.params
            const authData = user.get("authData", {})
            const googleEmail = authData && authData.google ? authData.google.email : null
            const authEmails = !authData ? [] : Object.values(authData).map(auth => auth.email)
            if (!user || user.id != userId || !user.get("emailVerified") && authEmails.indexOf(user.get("email")) === -1){
                return response.error({
                    success: false,
                    message: "User must be logged in with a verified email as the user that is being associated."
                })
            }
            const userDomain = email.toLowerCase().split("@")[1]
            console.log("UserDomain = ", userDomain)
            let query = new Parse.Query("Account")
            query.equalTo("emailDomain", userDomain)
            let account = await query.first()
            console.log("Fetched an account... resulting in ", account)
            if (!account){
                console.log("No account found for domain " + userDomain + "...creating new one")
                account = await createAccount(user, userDomain)
                if (!account){
                    return response.error({
                        success: false,
                        message: "No account found for domain",
                        code: "NO_ACCOUNT"
                    })
                }
            }
            console.log("Account ", account.toJSON())
            // find account seats
            let seatQuery = new Parse.Query("AccountSeat")
            seatQuery.equalTo("account", account)
            seatQuery.equalTo("active", true)
            seatQuery.doesNotExist("user")
            let userSeat = null
            let availableSeat = await seatQuery.first()
            if (availableSeat){
                console.log("adding user to seat: ", availableSeat)
                availableSeat.set("user", user)
                userSeat = await availableSeat.save(null, {useMasterKey: true})
                console.log("added user to seat")
            }
            else {
                userSeat = await createSeat(user, account, [ROLES.USER])
            }

            user.set({
                account,
                accountSeat: userSeat
            })
            let savedUser = await user.save(null, {useMasterKey: true})
            return response.success({
                success: true,
                account,
                accountSeat: userSeat,
                user: savedUser,
                message: `Added user to account ${account.get("name")}`
            })
        }
        catch (e){
            console.error("Failed to associte user with account", e)
            Raven.captureException(e)
            return response.error({
                success: false,
                error: e,
                message: "Something unexpected went wrong while associating the user to an acount."
            })
        }
    })
}

export default initialize;
