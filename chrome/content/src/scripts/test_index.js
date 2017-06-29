import React from "react";
import {render} from "react-dom";
import {Provider} from "react-redux";
import ThreadView from "ThreadView";
import store from "store/configureStore"
import {SET_SUBJECT, SET_BODY, SET_SENDER} from "ducks/thread"

store.dispatch({
    type: SET_SUBJECT,
    payload: "Test Subject"
})
store.dispatch({
    type: SET_SENDER,
    payload: {
        name: "Neil Poulin",
        emailAddress: "neil@neilpoulin.com"
    }
})
store.dispatch({
    type: SET_BODY,
    payload: "Some body cotent, blah blah blah blah."
})
render(
    <Provider store={store}>
        <ThreadView/>
    </Provider>,
    document.getElementById("app"))
