import Parse from "parse"
import React from "react"
import ParseReact from "parse-react"
import { withRouter } from "react-router"
import RoostNav from "navigation/RoostNav"
import AddAccountButton from "account/AddAccountButton"
import AccountSidebarList from "account/AccountSidebarList"
import BetaUserWelcome from "BetaUserWelcome"

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
        stakeholders.equalTo("inviteAccepted", true);
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
    render(){
        let contents = null;
        if ( this.pendingQueries().length > 0 ){
            contents =
            <div>
                <i className="fa fa-spin fa-spinner"></i>{" Loading..."}
                </div>
            }
            else
            {
                var deals = this.data.stakeholders.map(function(stakeholder){
                    return stakeholder.deal
                })
                if ( deals.length > 0){
                    contents = <AccountSidebarList deals={deals} className="bg-inherit"></AccountSidebarList>
                }
                else{
                    contents = <BetaUserWelcome userId={this.getCurrentUser().id}/>
                }
            }

            var homePage =
            <div>
                <RoostNav showHome={false}/>
                <div className="container UserHomePage col-md-6 col-md-offset-3 col-lg-4 col-lg-offset-4 lead">
                    <h1>Opportunities</h1>
                    <AddAccountButton
                        onSuccess={this.afterAddAccount}
                        btnClassName="btn-block btn-outline-primary"
                        />
                    {contents}
                </div>
            </div>

            return homePage;
        }
    }));
