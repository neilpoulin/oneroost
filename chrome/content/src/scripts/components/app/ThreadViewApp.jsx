import React from "react";
import {render} from "react-dom";
import {Provider} from "react-redux";
import ThreadView from "ThreadView";

const anchor = document.createElement("div");
anchor.className = "ThreadViewApp"

export default ({store}) => {
    render(<Provider store={store} className="">
            <ThreadView/>
        </Provider>,
        anchor)

    return anchor
}
