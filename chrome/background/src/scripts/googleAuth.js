import axios from "axios"
// helpful link https://developer.chrome.com/apps/app_identity
// https://developer.chrome.com/extensions/tut_oauth#oauth-dance
const webClientId = "298915058255-27b27sbb83fpe105kj12ccv0hc7380es.apps.googleusercontent.com";
const logoutUrl = "https://accounts.google.com/logout"
const redirectUri = chrome.identity.getRedirectURL("oauth2");
const verifyTokenUrl = "https://www.googleapis.com/oauth2/v3/tokeninfo"

var token = null;
var manifest = chrome.runtime.getManifest();

var scopes = encodeURIComponent(manifest.oauth2.scopes.join(" "));

window.gapi_onload = () => {
    gapi.load("client:auth2", initClient);
}
function getLastToken() {
    return token;
}

function initClient() {
    console.log("Client finished loading", gapi)
    oauth2(false)
}

export function handleSignInClick(event) {
    console.log("signin click fired")
    return oauth2(true);
}

function oauth2(interactive=true){
    var url = "https://accounts.google.com/o/oauth2/auth" +
    "?client_id=" + webClientId +
    "&response_type=token" +
    "&redirect_uri=" + redirectUri +
    "&scope=" + scopes;

    console.log(url)
    return new Promise((resolve, reject) => {
        chrome.identity.launchWebAuthFlow(
            {
                "url": url,
                "interactive": interactive
            },
            function(redirectUrl) {
                console.log("finished redirect", redirectUrl)
                if (redirectUrl){
                    console.log("launchWebAuthFlow login successful: ", redirectUrl);
                    var parsed = parse(redirectUrl.substr(chrome.identity.getRedirectURL("oauth2").length + 1));
                    token = parsed.access_token;
                    console.log("Background login complete.. token =", token);
                    getTokenInfo(token).then(({isValid, ...rest}) => {
                        if(isValid){
                            console.log("Token was found to be valid!!")
                            getGmailFilters()
                        }
                        else{
                            console.log("Token was not valid!")
                        }
                        resolve(rest)
                    })
                }
                else{
                    reject()
                }
            });
    })
}

function parse(str) {
    if (typeof str !== "string") {
        return {};
    }
    str = str.trim().replace(/^(\?|#|&)/, "");
    if (!str) {
        return {};
    }
    return str.split("&").reduce(function (ret, param) {
        var parts = param.replace(/\+/g, " ").split("=");
    // Firefox (pre 40) decodes `%3D` to `=`
    // https://github.com/sindresorhus/query-string/pull/37
        var key = parts.shift();
        var val = parts.length > 0 ? parts.join("=") : undefined;
        key = decodeURIComponent(key);
    // missing `=` should be `null`:
    // http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
        val = val === undefined ? null : decodeURIComponent(val);
        if (!ret.hasOwnProperty(key)) {
            ret[key] = val;
        }
        else if (Array.isArray(ret[key])) {
            ret[key].push(val);
        }
        else {
            ret[key] = [ret[key], val];
        }
        return ret;
    }, {});
}

export function handleSignOutClick(event) {
    return new Promise((resolve, reject) => {
        chrome.identity.launchWebAuthFlow({"url": logoutUrl, "interactive": false}, function (redirectUrl) {
            console.log("launchWebAuthFlow logout complete");
            getTokenInfo(token).then(tokenInfo => {
                console.log(tokenInfo)
                token=null
                resolve(tokenInfo)
            }).catch(error => {
                console.log(error)
                reject(error)
            })
        });
    })
}

export function getGmailFilters(){
    axios.get("https://www.googleapis.com/gmail/v1/users/me/settings/filters")
        .then(({data}) => {
            console.log("filters!", data)
        }).catch(console.error)
}

export function getCurrentUser(){
    return gapi.client.people.people.get({
        "resourceName": "people/me",
        "requestMask.includeField": "person.names"
    }).then((response) => {
        return response.result;
    }, (reason) => {
        console.error("Error: " + reason);
    });
}

export function getTokenInfo(token){
    console.log("attempting to validate token")
    return axios.get(`${verifyTokenUrl}?access_token=${token}`)
        .then(({data, status}) => {
            console.log("Validated token", data)
            if(data.aud === webClientId){
                axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
                return {...data, isValid: true};
            }
            return false
        }).catch(function (error) {
            console.log(error);
            delete axios.defaults.headers.common["Authorization"];
            return false;
        });
}
