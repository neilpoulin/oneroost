import React, { PropTypes } from 'react'
import NavLink from './../NavLink'
import { browserHistory } from 'react-router'

const AnonymousLinks = React.createClass({
    render () {
        return (
            <div>
                <ul className="nav navbar-nav">
                    <NavLink to="/">Home</NavLink>
                </ul>

                <ul className="nav navbar-nav navbar-right">
                    <NavLink to="/">Log In</NavLink>
                </ul>
            </div>
        )
    }
})

export default AnonymousLinks
