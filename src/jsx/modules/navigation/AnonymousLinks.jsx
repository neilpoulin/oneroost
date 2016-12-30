import React from "react"
import NavLink from "NavLink"

const AnonymousLinks = React.createClass({
    render () {
        var links =
        <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul className="nav navbar-nav">
                <NavLink to="/">Home</NavLink>
            </ul>

            <ul className="nav navbar-nav navbar-right">
                <NavLink to="/login">Log In</NavLink>
            </ul>
        </div>

        return links;
    }
})

export default AnonymousLinks
