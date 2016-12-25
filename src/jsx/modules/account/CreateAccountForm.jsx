import React from "react";
import {linkState} from "./../util/LinkState"
import ParseReact from "parse-react"
import Parse from "parse"
import FormUtil, {Validation} from "./../util/FormUtil"

export default React.createClass({
    getDefaultProps: function(){
        return{
            onSuccess: function(){}
        }
    },
    getInitialState: function(){
        return {
            accountName: "",
            dealName: "",
            primaryContact: "",
            streetAddress: "",
            city: "",
            state: "",
            zipCode: "",
            errors: {}
        };
    },
    doSubmit: function()
    {
        var self = this;
        var errors = FormUtil.getErrors(this.state, this.validations);
        console.log(errors);
        if ( Object.keys(errors).length === 0 && errors.constructor === Object ){
            this.saveDeal();
            this.setState({errors: {}});
            return true;
        }
        self.setState({errors: errors});
        return false;
    },
    saveDeal(){
        let self = this;
        var account = {
            createdBy: Parse.User.current(),
            accountName: this.state.accountName,
            primaryContact: this.state.primaryContact,
            streetAddress: this.state.streetAddress,
            city: this.state.city,
            state: this.state.state,
            zipCode: this.state.zipCode
        }
        var dealName = self.state.dealName;
        ParseReact.Mutation.Create("Account", account)
        .dispatch()
        .then( function( acct ){
            self.createDeal( acct, dealName );
        });
    },
    validations: {
        accountName: new Validation(FormUtil.notNullOrEmpty, "error", "You must provide a company name.") ,
        dealName: new Validation(FormUtil.notNullOrEmpty, "error", "You must enter a Problem Summary.")
    },
    createDeal: function( account, dealName ){
        var self = this;
        var deal = {
            createdBy: Parse.User.current(),
            account: account,
            dealName: dealName,
            profile: {"timeline": "2016-05-13"},
            budget: {"low": 0, "high": 0}
        }

        ParseReact.Mutation.Create( "Deal", deal )
        .dispatch()
        .then(function( newDeal ){
            self.createStakeholder(newDeal);
        });
    },
    createStakeholder(deal)
    {
        var self = this;
        var user = Parse.User.current();
        var stakeholder = {
            "user": user,
            "deal": deal,
            "role": "CREATOR",
            "inviteAccepted": true,
            "invitedBy": user
        };

        ParseReact.Mutation.Create("Stakeholder", stakeholder)
        .dispatch({waitForServer: true})
        .then( self.props.onSuccess );
    },
    render: function(){
        return (
            <div className="CreateAccount">
                <div>
                    <div className={"form-group " + FormUtil.getErrorClass("accountName", this.state.errors)}>
                        <label htmlFor="accountNameInput" className="control-label" >Company Name</label>
                        <input id="accountNameInput"
                            type="text"
                            className="form-control"
                            value={this.state.accountName}
                            onChange={linkState(this, "accountName")} />
                        {FormUtil.getErrorHelpMessage("accountName", this.state.errors)}
                    </div>
                    <div className={"form-group " + FormUtil.getErrorClass("dealName", this.state.errors)}>
                        <label htmlFor="dealNameInput" className="control-label" >Problem Summary</label>
                        <input id="dealNameInput"
                            type="text"
                            className="form-control"
                            value={this.state.dealName}
                            maxLength={40}
                            onChange={linkState(this, "dealName")} />
                        <span className="help-block">briefly explain your offering in 40 characters or less</span>
                        {FormUtil.getErrorHelpMessage("dealName", this.state.errors)}
                    </div>
                </div>
            </div>
        );
    }
});
