import React from "react"
import { browserHistory, withRouter } from "react-router"
import LoginComponent from "./LoginComponent"
import RoostNav from "./navigation/RoostNav"
import Logo from "./Logo"

const LoginPage = withRouter( React.createClass({
    handleLoginError: function(user, error)
    {
        switch( error.code )
        {
            case 101: //invalid login params
            break;
            case 202: //username taken
            break;
            default:
            break;
        }
        this.setState({"error": error});
        console.error(error);
        this.hideLoading();
    },
    handleLoginSuccess: function(){
        const { location } = this.props;
        if (location.state && location.state.nextPathname) {
            this.props.router.replace(location.state.nextPathname)
        } else {
            this.props.router.replace("/roosts")
        }
    },
    handleLogoutSuccess: function(){
        browserHistory.push("/");
    },
    handleLogoutError: function( user, error ){
        console.error( "failed to log out" );
        console.error( error );
    },
    render () {
        let page =
        <div className="RegisterPage col-md-6 col-md-offset-3 col-lg-4 col-lg-offset-4">
            <RoostNav showHome={false}/>
            <Logo/>
            <p className="lead">Please fill out the form below to get started.</p>
            <LoginComponent
                success={this.handleLoginSuccess}
                logoutSuccess={this.handleLogoutSuccess}
                />
        </div>

        return page;
    }
}))

export default LoginPage
