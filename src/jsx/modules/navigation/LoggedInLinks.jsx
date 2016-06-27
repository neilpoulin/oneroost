import React from "react"
import NavLink from "./../NavLink";
import Parse from "parse";

const LoggedInLinks = React.createClass({
    render () {
        var user = Parse.User.current();
        var links =
        <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul className="nav navbar-nav">
                <NavLink to="/" onlyActiveOnIndex>Home</NavLink>
                <NavLink to="/roosts">Roosts</NavLink>
            </ul>

            <ul className="nav navbar-nav navbar-right">
                <li className="dropdown">
                    <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true"
                        aria-expanded="false">
                        <i className="fa fa-user"></i> {user.get("username")} <span className="caret"></span>
                    </a>
                    <ul className="dropdown-menu">
                        <NavLink to="/roosts">Roosts</NavLink>
                        <li role="separator" className="divider"></li>
                        <NavLink to="/logout">Logout</NavLink>
                    </ul>
                </li>
            </ul>
        </div>

        return links;
    }
})

export default LoggedInLinks
