import Parse from 'parse';
import ParseReact from 'parse-react';
import React from 'react';
import Account from './../models/Account';
import Deal from './../models/Deal';
import _ from 'underscore';
import { Link } from 'react-router'


export default React.createClass({
    mixins: [ParseReact.Mixin],
    observe: function(){
        var accounts = [];
        var deals = [];
        if ( this.props.user )
        {
            accounts = (new Parse.Query(Account)).equalTo('createdBy', this.props.user );
            deals = (new Parse.Query(Deal)).equalTo('createdBy', this.props.user );
        }
        return {
            accounts: accounts,
            deals: deals
        }
    },
    render: function(){
        window.deals = this.data.deals;
        window.accounts = this.data.accounts;

        var accountMap = {};
        _.map(this.data.accounts, function(act){
            accountMap[act.objectId] = act;
        });
        window.accountMap = accountMap;
        return (
            <table className="table table-striped table-bordered table-hover">
                <thead>
                    <tr>
                        <th>Account</th>
                        <th>Deal Name</th>
                        <th>Primary Contact</th>
                    </tr>
                </thead>
                <tbody>
                    {this.data.deals.map(function(deal){
                        return (
                            <tr className="profileCard" key={"account_list_item_" + deal.objectId}>
                                <td>{accountMap[deal.account.objectId].accountName}</td>
                                <td><Link to={"/deals/" + deal.objectId} >{deal.dealName}</Link></td>
                                <td>{accountMap[deal.account.objectId].primaryContact}</td>
                            </tr>)
                        })
                    }
                    </tbody>
                </table>
            )
        }
    });
