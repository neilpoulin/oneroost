import React, { PropTypes } from 'react'
import { browserHistory } from 'react-router'

const LogoutLink = React.createClass({
    doLogout: function( e ){
        e.preventDefault();
        Parse.User.logOut();
        browserHistory.push('/');
    },
    render () {
        return (
            <a href="#" onClick={this.doLogout} {...this.props} >Logout</a>
        )
    }
})

export default LogoutLink
