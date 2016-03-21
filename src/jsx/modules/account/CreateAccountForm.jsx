import React from 'react';
import LinkedStateMixin from 'react-addons-linked-state-mixin';
import ParseReact from 'parse-react';
import Parse from 'parse';

export default React.createClass({
    mixins: [LinkedStateMixin],
    getInitialState: function(){
        return {
            accountName: null,
            dealName: null,
            primaryContact: null,
            streetAddress: null,
            timeline: null,
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
        var timeline = self.state.timelone;
        ParseReact.Mutation.Create("Account", account)
        .dispatch()
        .then( function( acct ){
            self.createDeal( acct, dealName, timeline );
        });
    },
    createDeal: function( account, dealName, timeline ){
        var self = this;
        var deal =  {
            createdBy: Parse.User.current(),
            account: account,
            dealName: dealName,
            timeline: timeline,
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
            "role": 'OWNER',
            "inviteAccepted": true,
            "invitedBy": user
        };

        ParseReact.Mutation.Create('Stakeholder', stakeholder)
        .dispatch()
        .then( self.props.createSuccess );
    },
    render: function(){
        return (
            <div className="CreateAccount">
                <div>
                    <div className="form-component">
                        <label htmlFor="accountNameInput" >Account Name</label>
                        <input id="accountNameInput" type="text" className="form-control" valueLink={this.linkState('accountName')} />
                    </div>
                    <div className="form-component">
                        <label htmlFor="dealNameInput" >Deal Name</label>
                        <input id="dealNameInput" type="text" className="form-control" valueLink={this.linkState('dealName')} />
                    </div>

                    <div className="form-component" >
                        <label htmlFor="primaryContactInput">Expected Close Date</label>
                        <input id="primaryContactInput" type="text" className="form-control" valueLink={this.linkState('timeline')} />
                    </div>
                </div>
            </div>
        );
    }
});
