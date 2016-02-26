import Parse from 'parse';
import ParseReact from 'parse-react';
import React from 'react';
import BootstrapModal from './BootstrapModal';
import CreateAccount from './CreateAccount';
import AccountList from './AccountList';
import LoginComponent from './LoginComponent';
import { browserHistory } from 'react-router'

export default React.createClass({
    mixins: [ParseReact.Mixin],
    observe: function(){
        var user = Parse.User.current();
        return {
            // accounts: (new Parse.Query(Parse.User)).ascending('createdAt').limit(10)
        }
    },
    handleLoginSuccess: function(){
        browserHistory.push("/my/home");
    },
    onAddAccount: function(e){
        this.refs.addAccountModal.open();
    },
    closeAddAccountModal: function(e){
        this.refs.addAccountModal.close();
        this.clearAddAccountForm();
    },
    saveNewAccount: function(){
        console.log("saving account...");
        var success = this.refs.createAccountForm.doSubmit();
        if ( success )
        {
            this.accountCreateSuccess();
        }
    },
    getCurrentUser: function()
    {
        return Parse.User.current();
    },
    clearAddAccountForm: function(){
        this.refs.createAccountForm.setState( this.refs.createAccountForm.getInitialState() );
    },
    showError: function(message){
        alert(message);
    },
    accountCreateSuccess: function(){
        this.closeAddAccountModal();
        this.refs.accountList.refreshQueries(['accounts', 'deals']);
        this.render();
    },
    logoutSuccess: function(){
        browserHistory.push("/");
    },
    render: function(){
        var currentUser = this.getCurrentUser();
        var accountCreateForm = (
            <CreateAccount
                user={currentUser}
                ref="createAccountForm"
                createSuccess={this.accountCreateSuccess}
                createError={this.showError}
                >
            </CreateAccount>
        );

        var addAccountModal = (
            <BootstrapModal
                ref="addAccountModal"
                confirm="Add"
                cancel="Cancel"
                onCancel={this.closeAddAccountModal}
                onConfirm={this.saveNewAccount}
                title="Add a new account">
                A modal to add a new account

                {accountCreateForm}

            </BootstrapModal>
        );

        var accounts = (
            <AccountList
                ref="accountList"
                user={currentUser} >
            </AccountList>
        );

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
                        <h1>My Accounts <button className="btn btn-primary" onClick={this.onAddAccount} >Add Account</button> </h1>
                        {addAccountModal}
                    </div>
                    <div className="row">
                        {accounts}
                    </div>
                </div>
            </div>
        );
    }
});
