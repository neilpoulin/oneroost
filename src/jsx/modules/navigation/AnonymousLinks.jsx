import React, { PropTypes } from 'react'
import NavLink from './../NavLink'
import { browserHistory } from 'react-router'

const AnonymousLinks = React.createClass({
    render () {
        return (
            <div>
                <ul className="nav navbar-nav">
                    <li><a href="#">Deals</a></li>
                </ul>

                <ul className="nav navbar-nav navbar-right">
                    <NavLink to="/">Home</NavLink>
                    <li><a href="#">Log In</a></li>
                </ul>
            </div>
        )
    }
})

export default AnonymousLinks
