import React from "react"

export default React.createClass({
    render() {
        var app =
        <div >
            {this.props.children}
        </div>
        return app;
    }
})
