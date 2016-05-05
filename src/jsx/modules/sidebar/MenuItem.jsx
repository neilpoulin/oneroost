import React from "react";
// import { browserHistory } from "react-router";

export default React.createClass({
    navigate: function() {
        if ( this.props.hash )
        {
            window.location.hash = this.props.hash;
        }
        else if ( this.props.location ){
            // browserHistory.push(this.props.location);
            window.location = this.props.location;
        }
    },

    render: function() {
        return (
            <div
                className="menu-item"
                onClick={this.navigate}>
                {this.props.children}
            </div>
        );
    }
});
