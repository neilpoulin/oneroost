import React from "react";
import Account from "models/Account"
import Deal from "models/Deal"
import Stakeholder from "models/Stakeholder"
import Parse from "parse"
import FormUtil from "FormUtil"
import {validations} from "account/AccountValidation"
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
        var errors = FormUtil.getErrors(this.state, validations);
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
        var dealName = self.state.dealName;
        let account = new Account();
        account.set({
            createdBy: Parse.User.current(),
            accountName: this.state.accountName,
            primaryContact: this.state.primaryContact,
            streetAddress: this.state.streetAddress,
            city: this.state.city,
            state: this.state.state,
            zipCode: this.state.zipCode
        });
        account.save().then(acct => {
            self.createDeal( acct, dealName );
        }).catch(error => {
            console.error(error);
        });
    },
    createDeal: function( account, dealName ){
        var self = this;

        let deal = new Deal();
        deal.set({
            createdBy: Parse.User.current(),
            account: account,
            dealName: dealName,
            profile: {"timeline": "2016-05-13"},
            budget: {"low": 0, "high": 0}
        });
        deal.save().then(newDeal => {
            self.createStakeholder(newDeal);
        }).catch(error => {
            console.error(error);
        });
    },
    createStakeholder(deal)
    {
        var self = this;
        var user = Parse.User.current();

        let stakeholder = new Stakeholder();
        stakeholder.set({
            "user": user,
            "deal": deal,
            "role": "CREATOR",
            "inviteAccepted": true,
            "invitedBy": user
        });

        stakeholder.save().then(self.props.onSuccess).catch(console.error)
    },
    render: function(){
        return (
            <div className="CreateAccount">
                <FormInputGroup
                    fieldName="accountName"
                    label="Company Name"
                    errors={this.state.errors}
                    onChange={val => this.setState({"accountName": val})}
                    value={this.state.accountName}
                    />

                <FormInputGroup
                    fieldName="dealName"
                    label="Problem Summary"
                    errors={this.state.errors}
                    onChange={val => this.setState({"dealName": val})}
                    value={this.state.dealName}
                    >
                    <span className="help-block">briefly explain your offering in 40 characters or less</span>
                </FormInputGroup>
            </div>
        );
    }
});
