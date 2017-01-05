import React from "react"
import LoginComponent from "LoginComponent"
import RoostNav from "RoostNav"
import Logo from "Logo"

const LoginPage = React.createClass({
    render () {

        let page =
        <div className="LoginPage">
            <RoostNav showRegister={true} showLogin={true} showHome={false}/>
            <div className="col-md-4 col-md-offset-4 col-lg-4 col-lg-offset-4">
                <Logo className="header"/>
                <p className="lead text-center">Please login below</p>
                <LoginComponent showRegister={true} isLogin={true} showCompany={true} />
            </div>
        </div>

        return page;
    }
})

export default LoginPage
