import React from "react"
import { browserHistory, withRouter } from "react-router"
import LoginComponent from "./LoginComponent"

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
        return <LoginComponent
            success={this.handleLoginSuccess}
            logoutSuccess={this.handleLogoutSuccess}
            />
    }
}))

export default LoginPage
