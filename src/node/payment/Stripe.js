import envUtil from "./../util/envUtil.js"
var stripe = require("stripe")(envUtil.getStripeSecretKey())

export default stripe;
