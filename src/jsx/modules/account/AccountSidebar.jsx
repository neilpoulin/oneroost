import React from 'react'
import Parse from 'parse';
import ParseReact from 'parse-react';
import Deal from './../../models/Deal';
import Account from './../../models/Account';
import AccountSidebarList from './AccountSidebarList';
import AddAccountButton from './AddAccountButton'


export default React.createClass({
    mixins: [ParseReact.Mixin],
    observe: function(props, state){
        var user = Parse.User.current();
        var dealQuery = new Parse.Query(Deal);
        dealQuery.include("account");
        dealQuery.ascending('dealName');

        var stakeholders = new Parse.Query("Stakeholder");
        stakeholders.include("deal");
        stakeholders.include(["deal.account"]);
        stakeholders.equalTo("user", user );

        return {
            stakeholders: stakeholders

        }
    },
    render () {
        var contents;
        if ( this.pendingQueries().length > 0 ){
            contents = (
                <div>Loading....</div>
            )
        }
        else {
            var deals = this.data.stakeholders.map(function(stakeholder){
                    return stakeholder.deal
                })
                .sort(function(a, b){
                    a.dealName <= b.dealName;
                });
            contents = <AccountSidebarList deals={deals} />
        }

        return (
            <div id="accountSidebar" className="col-md-2 container-fluid hidden-sm hidden-xs">            
                <AddAccountButton btnClassName="btn-success">
                    <i className="fa fa-plus">Create Account</i>
                </AddAccountButton>
                {contents}
            </div>
        )
    }
})
