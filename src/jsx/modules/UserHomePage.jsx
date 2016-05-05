import Parse from 'parse';
import React from 'react';
import LoginComponent from './LoginComponent';
import { browserHistory } from 'react-router';

export default React.createClass({
    handleLoginSuccess: function(){
        browserHistory.push("/my/home");
    },
    getCurrentUser: function()
    {
        return Parse.User.current();
    },
    logoutSuccess: function(){
        browserHistory.push("/");
    },
    render: function(){
        var currentUser = this.getCurrentUser();

        if ( !this.getCurrentUser() )
        {
            // document.location = "/";
            browserHistory.push("/");
            return (null);
        }

        return (
            <div className="container UserHomePage">
                <div className="col-md-10 col-md-offset-1">
                    <div className="row text-center">
                        <h1>Welcome to OneRoost!</h1>
                    </div>
                    <div className="row text-center">
                        <div className="container-fluid lead">
                            Get started by jumping to a deal on the left, or creating a new one by clicking the button below.
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="container-fluid">
                            
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});
