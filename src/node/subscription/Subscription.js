import envUtil from "./../util/envUtil.js"
import * as stripe from "./../payment/Stripe"
var ParseCloud = require("parse-cloud-express");
import Raven from "raven"
var Parse = ParseCloud.Parse;
Parse.serverURL = envUtil.serverURL;

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
            if (!user || user.id != userId || !user.get("emailVerified")){
                return response.error({
                    success: false,
                    message: "User must be logged in with a verified email as the user that is being associated."
                })
            }
            const userDomain = email.split("@")[1]
            console.log("UserDomain = ", userDomain)
            let query = new Parse.Query("Account")
            query.equalTo("emailDomain", userDomain)
            let account = await query.first()
            console.log("found account", account)

            // TODO: just create an acount if not found?
            if (!account){
                return response.error({
                    success: false,
                    message: "No account found for domain"
                })
            }

            user.set({account})
            let savedUser = await user.save(null, {useMasterKey: true})
            return response.success({
                success: true,
                account,
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
