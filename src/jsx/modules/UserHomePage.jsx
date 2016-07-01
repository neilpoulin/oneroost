import Parse from "parse";
import React from "react";
import ParseReact from "parse-react";
import { withRouter } from "react-router";
import NavLink from "./NavLink";
import RoostNav from "./navigation/RoostNav";
import AddAccountButton from "./account/AddAccountButton";

export default withRouter( React.createClass({
    mixins: [ParseReact.Mixin],
    observe: function(props, state){
        var user = Parse.User.current();
        var stakeholders = new Parse.Query("Stakeholder");
        stakeholders.include("deal");
        stakeholders.include(["deal.account"]);
        stakeholders.equalTo("user", user );
        return {
            stakeholders: stakeholders
        }
    },
    getCurrentUser: function()
    {
        return Parse.User.current();
    },
    afterAddAccount: function(stakeholder){
        this.props.router.replace("/roosts/" + stakeholder.deal.objectId )
    },
    render: function(){
        var contents = null;
        if ( this.pendingQueries().length > 0 ){
            contents = <div><i className="fa fa-spin fa-spinner"></i> Loading....</div>;
            }
            else {
                var deals = this.data.stakeholders.map(function(stakeholder){
                    return stakeholder.deal
                })
                .sort(function(a, b){
                    a.dealName <= b.dealName;
                });
                contents = <ul className="AccountSidebarList">
                    {deals.map(function(deal){
                        var item =
                        <NavLink className="UserHomeListItem" to={"/roosts/" + deal.objectId} activeClassName="active">
                            <span className="dealName">{deal.dealName}</span>
                            <span className="accountName">{deal.account.accountName}</span>
                        </NavLink>

                        return item;
                    })}
                </ul>;
            }


            var homePage =
            <div>
                <RoostNav showHome={false}/>
                <div className="container UserHomePage ">
                    <h1>My Roosts</h1>
                    <AddAccountButton
                        onSuccess={this.afterAddAccount}
                        />
                    {contents}
                </div>
            </div>

            return homePage;
    }
}) );
