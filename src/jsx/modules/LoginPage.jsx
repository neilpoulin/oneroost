import React from "react"
import LoginComponent from "LoginComponent"
import RoostNav from "RoostNav"
import Logo from "Logo"

const LoginPage = React.createClass({
    render () {

        let page =
        <div className="LoginPage">
            <RoostNav/>
            <div className="col-md-6 col-md-offset-3 col-lg-4 col-lg-offset-4">
                <Logo className="header"/>
                <LoginComponent showRegister={false}/>
            </div>
        </div>

        return page;
    }
})

export default LoginPage
