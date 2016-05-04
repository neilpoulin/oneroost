import React from "react";
import LinkedStateMixin from "react-addons-linked-state-mixin";
import ParseReact from "parse-react";
import Parse from "parse";

export default React.createClass({
    mixins: [LinkedStateMixin],
    getDefaultProps: function(){
        return{
            onSuccess: function(){}
        }
    },
    getInitialState: function(){
        return {
            accountName: null,
            dealName: null,
            primaryContact: null,
            streetAddress: null,
            city: null,
            state: null,
            zipCode: null
        };
    },
    doSubmit: function()
    {
        var self = this;
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
            console.log( "saved new deal" );
            console.log(newDeal);
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
            "role": "OWNER",
            "inviteAccepted": true,
            "invitedBy": user
        };

        ParseReact.Mutation.Create("Stakeholder", stakeholder)
        .dispatch()
        .then( self.props.onSuccess );
    },
    render: function(){
        return (
            <div className="CreateAccount">
                <div>
                    <div className="form-component">
                        <label htmlFor="accountNameInput" >Client</label>
                        <input id="accountNameInput" type="text" className="form-control" valueLink={this.linkState("accountName")} />
                    </div>
                    <div className="form-component">
                        <label htmlFor="dealNameInput" >Opportunity</label>
                        <input id="dealNameInput" type="text" className="form-control" valueLink={this.linkState("dealName")} />
                    </div>
                </div>
            </div>
        );
    }
});
