import googleCreds from "./google-client.json";

const clientId = googleCreds.installed.client_id;

window.gapi_onload = () => {
    gapi.load("client", initClient);
}

function initClient() {
    console.log("Client finished loading")
}

export function updateSigninStatus(isSignedIn) {
    // When signin status changes, this function is called.
    // If the signin status is changed to signedIn, we make an API call.
    if (isSignedIn) {
        console.log("Is signed in")
        // makeApiCall();
    }
}

export function handleSignInClick(event) {
    chrome.identity.getAuthToken({ "interactive": true }, function(token) {
        // Use the token.
        gapi.auth.authorize(
            {
                client_id: clientId,
                immediate: true,
                scope: "https://www.googleapis.com/auth/gmail.modify"
            },
            function(){
                updateSigninStatus(true)
                gapi.client.load("gmail", "v1", () => getGmailFilters().then(filters => console.log("Got Filters!", filters)));
                gapi.client.load("people", "v1", () => getCurrentUser().then(name => console.log("Hello, ", name)));
            }
        );
    });
}

export function handleSignOutClick(event) {
    console.warn("No sign out is implemented yet")
}

export function getGmailFilters(){
    return gapi.client.gmail.users.settings.filters.list({
        "userId": "me"
    }).then(response => {
        if(response && response.result && response.result.filter) {
            return response.result.filter.map(filter => JSON.stringify(filter.criteria));
        }
        return "no results found";
    }, (error) => {
        console.error(error);
    });
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
