import React from "react";
import {render} from "react-dom";
import {Provider} from "react-redux";
import {Store} from "react-chrome-redux";
import ThreadView from "ThreadView";

const anchor = document.createElement("div");

const proxyStore = new Store({
    state: {},
    portName: "oneroost"
});

export default ({subject}) => {
    render(
        <Provider store={proxyStore}>
            <ThreadView subject={subject}/>
        </Provider>,
        anchor)

    return anchor
}
