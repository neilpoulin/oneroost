import React from "react"
import TopNav from "./navigation/TopNav";

export default React.createClass({
    render() {
        var app =
        <div >
            <TopNav/>
            {this.props.children}
        </div>
        return app;
    }
})
