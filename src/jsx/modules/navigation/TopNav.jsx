import React, { PropTypes } from 'react'
import Parse from 'parse';
import AnonymousLinks from './AnonymousLinks';
import LoggedInLinks from './LoggedInLinks';

const TopNav = React.createClass({
    isLoggedIn: function(){
        return Parse.User.current() != null;
    },
    render: function() {
        var links = (<AnonymousLinks/>);
        if ( this.isLoggedIn() )
        {
            links = (<LoggedInLinks user={Parse.User.current()} />);
        }

        return (
            <nav className="navbar navbar-default navbar-fixed-top">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                    </div>
                    <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                        {links}
                    </div>
                </div>
            </nav>
        )
    }
})

export default TopNav
