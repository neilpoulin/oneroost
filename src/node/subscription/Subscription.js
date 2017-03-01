import envUtil from "./../util/envUtil.js"
import stripe from "./../payment/Stripe"
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
            
            console.log("plan:", plan);
            response.success({"success": "Created a plan!"})
        }
        catch(e){
            console.error("Failed to execute addStakeholder function", e);
            response.error({error: "something went wrong", object: e });
            Raven.captureException(e)
        }
    })
}

export default initialize;
