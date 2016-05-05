import React from "react"
import LoginComponent from "./LoginComponent"
import { browserHistory } from "react-router"

export default React.createClass({
    handleLoginSuccess: function(){
        browserHistory.push("/deals");
    },
    handleLogoutSuccess: function(){
        browserHistory.push("/");
    },
    render: function(){
        return (
            <div className="container ">
                <div className="row">
                    <div className="page-header">
                        <h1 className="text-center">Welcome to One Roost</h1>
                    </div>
                </div>
                <div className="row">
                    <div className="container ">
                        <div className="col-md-4 col-md-offset-4 col-sm-6 col-sm-offset-3">
                            <LoginComponent
                                success={this.handleLoginSuccess}
                                logoutSuccess={this.handleLogoutSuccess} >
                            </LoginComponent>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
})
