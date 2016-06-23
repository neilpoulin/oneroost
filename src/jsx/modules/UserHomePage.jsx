import Parse from "parse";
import React from "react";
import { browserHistory } from "react-router";

export default React.createClass({
    handleLoginSuccess: function(){
        browserHistory.push("/my/home");
    },
    getCurrentUser: function()
    {
        return Parse.User.current();
    },
    render: function(){        
        var homePage =
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
        </div>;

        return homePage;
    }
});
