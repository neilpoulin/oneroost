var envUtil = require("./../util/envUtil.js");
var ParseCloud = require("parse-cloud-express");
var crypto = require("crypto");
var axios = require("axios");
var qs = require("querystring");
var Parse = ParseCloud.Parse;

const LINKEDIN_TOKEN_URI = "https://www.linkedin.com/oauth/v2/accessToken"

exports.initialize = function(){
    console.log("Initializing SecurityController")
    Parse.Cloud.define("getIntercomHMAC", function(request, response) {
        var currentUser = request.user;
        if(currentUser){
            const userId = currentUser.id
            const hmac = crypto.createHmac("sha256", envUtil.getIntercomSecretKey());
            hmac.update(userId);
            let hmacString = hmac.digest("hex")
            console.log("Created hmac for user", userId);
            return response.success({hmac: hmacString})
        }
        else {
            console.log("No user was found for the given request. Not generating an HMAC.")
        }
        return response.success()
    });

    Parse.Cloud.define("getOAuthToken", (request, response) => {
        const {provider} = request.params;
        switch (provider.toLowerCase()) {
            case "linkedin":
                handleLinkedIn(request.params)
                    .then(response.success)
                    .catch(console.error)
                break;
            default:
                return response.error({
                    error: "Provider not supported"
                })
        }
    })

    Parse.Cloud.define("checkEmailAfterOAuth", (request, response) => {        
        const user = request.user;
        const userEmail = user.get("email")
        const authData = user.get("authData")
        let matchedEmail = Object.values(authData).map(auth => auth.email).filter(authEmail => !!authEmail && authEmail === userEmail)
        if (matchedEmail){
            user.set("emailVerified", true);
            user.save(null, {useMasterKey: true}).then(user => {
                return response.success({
                    emailVerified: true,
                })
            }).catch(error => response.error({error}))
        }
    })
}

function handleLinkedIn({code, redirectUri}){
    console.log("exchanging linkedin code for auth token")
    let clientId = envUtil.LINKEDIN_CLIENT_ID
    let clientSecret = envUtil.LINKEDIN_CLIENT_SECRET
    let baseUri = LINKEDIN_TOKEN_URI

    let formData = {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
        code
    }

    return axios.post(baseUri, qs.stringify(formData))
        .then(({data}) => {
            console.log("Successfully turned LinkedIn code into an accesstoken", data);
            return {
                access_token: data.access_token
            }
        })
        .then(({access_token}) => {
            console.log("fetching profile info")
            return axios.get("https://api.linkedin.com/v1/people/~:(email-address,id,firstName,lastName,industry,location,positions)?format=json", {headers: {
                Authorization: `Bearer ${access_token}`
            }})
                .then(({data}) => {
                    console.log("Profile response form linkedin", data)
                    let company = {}
                    let positions = data.positions;
                    if (positions && positions.values){
                        company = positions.values[0].company || {}
                    }
                    return {
                        access_token,
                        id: data.id,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        jobTitle: data.headline,
                        industry: data.industry,
                        location: data.location,
                        company: company.name,
                        email: data.emailAddress,
                    }
                })
        })
        .catch(error => {
            console.error("Failed to get access_token", error);
        })
}
