import envUtil from "./../util/envUtil.js"
import Raven from "raven"
let stripe = require("stripe")(envUtil.getStripeSecretKey())

/**
* Returns customerId. If user already has a customerId, it returns immediately.
* If not, a customerId will be created
*/
export const createCustomer = async (user) => {
    let customerId = user.get("stripeCustomerId")
    if (customerId){
        return customerId
    }
    let email = user.get("email");

    // note: may want to create this after we've collected payment info, then attach the "source"
    return stripe.customers.create({
        description: "Customer for " + email,
        email,
        // source: "tok_19sMO5DGirDqksCcUiibHFRQ" // obtained with Stripe.js
    }).then(customer => {
        console.log("Customer created from stripe", customer)
        return customer.id
    }).catch(e => {
        Raven.captureException(e)
        console.error("failed to create customer", e)
    })
}

export const createSubscription = async (user, plan, token) => {
    let customerId = await createCustomer(user)
    let source = token
    if ( typeof token === "object"){
        source = token.id
    }

    return stripe.subscriptions.create({
        customer: customerId,
        source,
        plan,
    }).then(subscription => {
        console.log("created subscription!", subscription)
        return subscription
    }).catch( error => {
        Raven.captureException(error)
        console.error("Failed to create subscription", error)
    })
}

export default stripe;
