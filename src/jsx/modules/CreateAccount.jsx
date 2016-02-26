import React from 'react';
import Account from './../models/Account';
import Deal from './../models/Deal';
import LinkedStateMixin from 'react-addons-linked-state-mixin';

export default React.createClass({
    mixins: [LinkedStateMixin],
    getInitialState: function(){
        return {
            accountName: null,
            primaryContact: null,
            streetAddress: null,
            city: null,
            state: null,
            zipCode: null
        };
    },
    setAccountName: function(e)
    {
        this.setState({accountName: e.target.value});
    },
    doSubmit: function()
    {
        var component = this;
        var account = new Account();
        account.set("createdBy", this.props.user);
        account.set("accountName", this.state.accountName);
        account.set("primaryContact", this.state.primaryContact);
        account.set("streetAddress", this.state.streetAddress);
        account.set("city", this.state.city);
        account.set("state", this.state.state);
        account.set("zipCode", this.state.zipCode);

        account.save(null, {
            success: component.accountCreateSuccess,
            error: component.accountCreateError
        });

    },
    accountCreateSuccess: function( account ){
        if ( this.props.createSuccess )
        {
            var component = this;
            var deal =  new Deal();
            deal.set("createdBy", component.props.user);
            deal.set("account", account );
            deal.set("dealName", component.state.dealName);
            deal.set("profile", {});
            deal.set("stakeholders", []);
            deal.set("budget", {"low": 0, "high": 0});

            deal.save(null, {
                success: component.dealCreateSuccess,
                error: component.dealCreateError
            });
        }
    },
    accountCreateError: function(){
        if ( this.props.createError )
        {
            this.props.createError("Failed to create an account. ");
        }
    },
    dealCreateSuccess: function( deal ){
        this.props.createSuccess();
    },
    dealCreateError: function(){
        if ( this.props.createError )
        {
            this.props.createError("Failed to create the deal.");
        }
    },
    render: function(){
        return (
            <div className="CreateAccount">
                <div>Create Account Form for {this.props.user.get("username")}</div>
                <div>
                    <div className="form-component">
                        <label for="accountNameInput" >Account Name</label>
                        <input id="accountNameInput" type="text" className="form-control" valueLink={this.linkState('accountName')} />
                    </div>
                    <div className="form-component">
                        <label for="dealNameInput" >Deal Name</label>
                        <input id="dealNameInput" type="text" className="form-control" valueLink={this.linkState('dealName')} />
                    </div>
                    <div className="form-component" >
                        <label for="primaryContactInput">Primary Contact Name</label>
                        <input id="primaryContactInput" type="text" className="form-control" valueLink={this.linkState('primaryContact')} />
                    </div>
                </div>
            </div>
        );
    }
});
