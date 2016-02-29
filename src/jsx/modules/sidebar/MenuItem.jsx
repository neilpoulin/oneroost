import React from 'react';
import { browserHistory } from 'react-router';
import { Link } from 'react-router'

export default React.createClass({
    navigate: function() {
        if ( this.props.hash )
        {
            window.location.hash = this.props.hash;
        }
        else if ( this.props.location ){
            browserHistory.push(this.props.location);
        }
    },
    render: function() {
        return (<div className="menu-item" >
            <Link to={this.props.location}>
                {this.props.children}
            </Link>            
        </div>);
    }
});
