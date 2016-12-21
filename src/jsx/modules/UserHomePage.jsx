import Parse from "parse";
import React from "react";
import ParseReact from "parse-react";
import { withRouter } from "react-router";
import NavLink from "./NavLink"
import RoostNav from "./navigation/RoostNav";
import AddAccountButton from "./account/AddAccountButton";
import AccountSidebarList from "./account/AccountSidebarList"

export default withRouter( React.createClass({
    mixins: [ParseReact.Mixin],
    observe: function(props, state){
        var user = Parse.User.current();
        var stakeholders = new Parse.Query("Stakeholder");
        stakeholders.include("deal");
        stakeholders.include(["deal.account"]);
        stakeholders.include("deal.createdBy");
        stakeholders.include("deal.readyRoostUser");
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
    componentDidMount(){
        document.title = "My Opportunities | OneRoost"
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

                contents = <AccountSidebarList deals={deals} className="bg-inherit"></AccountSidebarList>
            }


            var homePage =
            <div>
                <RoostNav showHome={false}/>
                <div className="container UserHomePage ">
                    <h1>Opportunities</h1>
                    <AddAccountButton
                        onSuccess={this.afterAddAccount}
                        />
                    {contents}
                </div>
            </div>

            return homePage;
    }
}) );
