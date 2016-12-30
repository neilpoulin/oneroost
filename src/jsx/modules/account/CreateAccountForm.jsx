import React from "react";
import ParseReact from "parse-react"
import Parse from "parse"
import FormUtil from "FormUtil"
import AccountValidation from "account/AccountValidation"
import FormInputGroup from "FormInputGroup"

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
        var errors = FormUtil.getErrors(this.state, AccountValidation);
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
                <FormInputGroup
                    fieldName="accountName"
                    label="Company Name"
                    errors={this.state.errors}
                    onChange={val => this.setState("accountName", val)}
                    value={this.state.accountName}
                    />

                <FormInputGroup
                    fieldName="dealName"
                    label="Problem Summary"
                    errors={this.state.errors}
                    onChange={val => this.setState("dealName", val)}
                    value={this.state.dealName}
                    >
                    <span className="help-block">briefly explain your offering in 40 characters or less</span>
                </FormInputGroup>
            </div>
        );
    }
});
