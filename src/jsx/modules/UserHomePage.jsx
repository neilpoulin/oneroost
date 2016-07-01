import Parse from "parse";
import React from "react";
import ParseReact from "parse-react";
import { browserHistory } from "react-router";
import NavLink from "./NavLink";


export default React.createClass({
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
    handleLoginSuccess: function(){
        browserHistory.push("/my/home");
    },
    getCurrentUser: function()
    {
        return Parse.User.current();
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
            <div className="container UserHomePage ">
                <h1>My Roosts</h1>
                {contents}
            </div>;

            return homePage;
    }
});
