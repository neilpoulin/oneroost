import React from "react"
import LoginOnly from "LoginOnly"
import RoostNav from "RoostNav"
import Logo from "Logo"

const LoginPage = React.createClass({
    render () {

        let page =
        <div className="LoginPage">
            <RoostNav/>
            <Logo className="header"/>
            <LoginOnly/>
        </div>

        return page;
    }
})

export default LoginPage
