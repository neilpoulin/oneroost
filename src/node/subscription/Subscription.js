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
            response.success({
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
            response.success({
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
            response.error({
                success: false,
                error: e,
                message: "Something unexpected went wrong while creating the subscription"})
            Raven.captureException(e)
        }
    })

}

export default initialize;
