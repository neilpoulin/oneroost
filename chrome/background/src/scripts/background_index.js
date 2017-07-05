import {wrapStore} from "react-chrome-redux"
import store from "store/configureStore"
import Parse from "parse"
import axios from "axios"

const oneroostDomain = "https://dev.oneroost.com"

wrapStore(store, {
    portName: "oneroost"
})
//
// var oauth = ChromeExOAuth.initBackgroundPage({
//     "request_url": "https://www.google.com/accounts/OAuthGetRequestToken",
//     "authorize_url": "https://www.google.com/accounts/OAuthAuthorizeToken",
//     "access_url": "https://www.google.com/accounts/OAuthGetAccessToken",
//     "consumer_key": "anonymous",
//     "consumer_secret": "anonymous",
//     // "scope": "https://www.googleapis.com/auth/gmail.modify",
//     "scope": "https://docs.google.com/feeds/",
//     "app_name": "Oneroost Auth Extension",
//     // "auth_params": {
//     //     "callback_page": "chrome_ex_oauth.html"
//     // }
// });

// oauth.authorize(function() {
//   // ... Ready to fetch private data ...
//     debugger;
// });

axios.get(`${oneroostDomain}/config`).then(({data}) => {
    console.log(data)
    Parse.initialize(data.applicationId);
    Parse.serverURL = `${oneroostDomain}/parse`;
})
