import React, { PropTypes } from 'react'
import NavLink from './../NavLink';
import Parse from 'parse';
import LogoutLink from './LogoutLink';
import AddAccountButton from './../account/AddAccountButton';

const LoggedInLinks = React.createClass({
    render () {
        var user = Parse.User.current();
        return (
            <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                <ul className="nav navbar-nav">
                    <NavLink to='/' onlyActiveOnIndex>Home</NavLink>
                    <NavLink to='/deals'>Deals</NavLink>
                </ul>

                <div className="navbar-form navbar-left">
                    <AddAccountButton className="navbar-btn">
                        <i className="fa fa-plus">&nbsp;Create Account</i>
                    </AddAccountButton>
                </div>

                <ul className="nav navbar-nav navbar-right">
                    <li className="dropdown">
                        <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                            <i className="fa fa-user"></i> {user.get("username")} <span className="caret"></span>
                        </a>
                        <ul className="dropdown-menu">
                            <NavLink to='/deals'>Deals</NavLink>
                            <li role="separator" className="divider"></li>
                            <li><LogoutLink/></li>
                        </ul>
                    </li>
                </ul>
            </div>

        )
    }
})

export default LoggedInLinks
