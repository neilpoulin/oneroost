import React, { PropTypes } from "react"
import Parse from "parse"
import NavLink from "NavLink"
import { withRouter } from "react-router"

const LandingPage = withRouter( React.createClass({
    PropTypes: {
        location: PropTypes.object.isRequired
    },
    getLoginLink(){
        var user = Parse.User.current();
        if ( !user )
        {
            return {name: "Login", path: "/login"}
        }
        return {
            name: user.get("firstName") + " " + user.get("lastName"),
            path: "/roosts"
        }
    },
    componentDidMount(){
        document.title = "OneRoost"
    },
    render () {
        var loginLink = this.getLoginLink();
        var page =
        <div className={"LandingPage "} >
            <div className="container">
                <NavLink className="loginLink" to={loginLink.path} activeClassName="active" tag="span">
                    {loginLink.name}
                </NavLink>
                <h1 className="logo cursive">
                    OneRoost
                </h1>
                <div className="content text-center">
                    Denver, Colorado
                </div>
            </div>
        </div>
        return page;
    }
}) )

export default LandingPage
