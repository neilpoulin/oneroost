import ThreadViewApp from "ThreadViewApp"

const iconUrl = "https://www.oneroost.com/favicon.ico"

InboxSDK.load("2", "sdk_oneroost_f06bd06a99").then(function(sdk){
    // the SDK has been loaded, now do something with it!
    sdk.Compose.registerComposeViewHandler(function(composeView){
        // a compose view has come into existence, do something with it!
        composeView.addButton({
            title: "OneRoost !",
            iconUrl,
            onClick: function(event) {
                event.composeView.insertTextIntoBodyAtCursor("OneRoost is working even better! Now with Really Hot Reloading.........");
            },
        });
    });

    sdk.Conversations.registerThreadViewHandler(function(threadView){
        const subject = threadView.getSubject()
        var app = ThreadViewApp({
            subject
        })
        threadView.addSidebarContentPanel({
            el: app,
            title: "Thread Info",
            iconUrl,
        });
    });
});
