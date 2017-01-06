import React from "react"
import LoginComponent from "LoginComponent"
import RoostNav from "navigation/RoostNav"
import Logo from "Logo"

const LoginPage = React.createClass({
    handleLogoutError: function( user, error ){
        console.error( "failed to log out" );
        console.error( error );
    },
    componentDidMount(){
        document.title = "Sign Up | OneRoost"
    },
    render () {
        let page =
        <div className="RegisterPage col-md-4 col-md-offset-4 col-lg-4 col-lg-offset-4">
            <RoostNav showHome={false}/>
            <Logo/>
            <p className="lead text-center">Please fill out the form below to get started.</p>
            <LoginComponent showCompany={true}/>
        </div>

        return page;
    }
})

export default LoginPage
