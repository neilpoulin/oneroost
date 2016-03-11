import Parse from 'parse';
import React from 'react';
import AccountList from './AccountList';
import LoginComponent from './LoginComponent';
import { browserHistory } from 'react-router';
import AddAccountButton from './account/AddAccountButton';

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
            document.location = "/";
            return;
        }

        return (
            <div className="container">
                <LoginComponent logoutSuccess={this.logoutSuccess} ></LoginComponent>
                <div className="col-md-10 col-md-offset-1">
                    <div className="row">
                        <h1>My Accounts</h1>
                        <AddAccountButton>
                            <i className="fa fa-plus">&nbsp;Create Account</i>
                        </AddAccountButton>
                    </div>
                    <div className="row">
                        <AccountList
                            ref="accountList"
                            user={currentUser} >
                        </AccountList>
                    </div>
                </div>
            </div>
        );
    }
});
