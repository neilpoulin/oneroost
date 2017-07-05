import {fromElement} from "RedirectDropdownApp"

const iconUrl = "https://www.oneroost.com/favicon.ico"
const composeText = "Thanks for reaching out."
+ "I'm excited to hear what more about your product/service."
+ "Please provide an overview of your offering by going to http://www.oneroost.com/oneroost"

export function composeViewHandler(composeView){
    // a compose view has come into existence, do something with it!
    composeView.addButton({
        title: "OneRoost Redirect",
        iconUrl,
        hasDropdown: true,
        enabled: true,
        type: "MODIFIER",
        onClick: handleRedirectClick,
    });
}

export function handleRedirectClick(e){
    console.log("handling click", e)
    const composeView = e.composeView
    const dropdown = e.dropdown
    //NOTE: you can't set the text or subject of the email in composeView unless you want the dropdown to close
    dropdown.setPlacementOptions({
        position: "top",
    })

    fromElement(dropdown.el, composeView).then(() => {
        console.log("registered the React component")
    })
}
