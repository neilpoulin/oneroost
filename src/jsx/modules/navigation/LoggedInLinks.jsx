import React, { PropTypes } from 'react'
import NavLink from './../NavLink';
import LogoutLink from './LogoutLink';

const LoggedInLinks = React.createClass({
    render () {
        return (
            <div>
                <ul className="nav navbar-nav">
                    <NavLink to='/' onlyActiveOnIndex>Home</NavLink>
                    <NavLink to='/deals'>Deals</NavLink>
                </ul>

                <ul className="nav navbar-nav navbar-right">
                    <li className="dropdown">
                        <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                            <i className="fa fa-user"></i> {this.props.user.username} <span className="caret"></span>
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
