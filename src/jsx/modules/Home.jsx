import React from "react"
import LoginComponent from "./LoginComponent"
import { browserHistory, withRouter } from "react-router"

const Home = withRouter( React.createClass({
    handleLoginSuccess: function(){
        const { location } = this.props;
        if (location.state && location.state.nextPathname) {
            this.props.router.replace(location.state.nextPathname)
        } else {
            this.props.router.replace('/roosts')
        }
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
}) );

export default Home;
