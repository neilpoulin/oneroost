import {Store} from "react-chrome-redux"
import ThreadViewApp from "ThreadViewApp"
import {SET_SUBJECT, SET_BODY, SET_SENDER, SET_ROOST_ID, RESET_THREAD} from "actions/thread"
import {composeViewHandler} from "RedirectButtonController"

const iconUrl = "https://www.oneroost.com/favicon.ico"

const store = new Store({
    portName: "oneroost"
});

const loadSDK = InboxSDK.load("2", "sdk_oneroost_f06bd06a99", {
    appName: "OneRoost",
    appIconUrl: chrome.runtime.getURL("images/oneroost_logo_square_128x128.png")
})
const storeReady = store.ready()
let dispatch = store.dispatch

Promise.all([loadSDK, storeReady]).then(function([sdk, isReady]){
    console.log("SDK and store are loaded")
    dispatch = store.dispatch
    // let oneroostRoute = sdk.Router.createLink(oneroostRouteId, {})
    // console.log("oneroostRoute", oneroostRoute)
    // the SDK has been loaded, now do something with it!
    sdk.Compose.registerComposeViewHandler(composeViewHandler);

    sdk.Conversations.registerThreadViewHandler(function(threadView){
        const subject = threadView.getSubject()
        dispatch({type: RESET_THREAD})
        dispatch({type: SET_SUBJECT, payload: subject})
        var app = ThreadViewApp
        threadView.addSidebarContentPanel({
            el: app,
            title: "Thread Info",
            iconUrl,
        });
    });

    sdk.Conversations.registerMessageViewHandler(function(messageView){
        const $messageBody = messageView.getBodyElement();
        const sender = messageView.getSender();
        const links = messageView.getLinksInBody();
        if (links){
            let roostLink = links.find(link => link.href.indexOf("oneroost.com/roosts/") != -1)
            if (roostLink){
                let roostId = roostLink.href.split("roosts/")[1].split("/")[0]
                dispatch({type: SET_ROOST_ID, payload: roostId})
            }
        }
        dispatch({type: SET_BODY, payload: $messageBody.innerText})
        dispatch({type: SET_SENDER, payload: sender})
        // var messageApp = MessageViewApp({
        //     store: store
        // })
    })
});
