import React from "react"
import Parse from "parse"
import ParseReact from "parse-react"
import AccountSidebarList from "./AccountSidebarList"
import AddAccountButton from "./AddAccountButton"

export default React.createClass({
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
    getDefaultProps: function(){
        return {
            isMobile: false
        }
    },
    onSuccess: function(){
        this.refreshQueries(["stakeholders"]);
    },
    render () {
        var contents;
        if ( this.pendingQueries().length > 0 ){
            contents = <div>Loading....</div>;
        }
        else {
            var deals = this.data.stakeholders.map(function(stakeholder){
                    return stakeholder.deal
                })
            contents = <AccountSidebarList deals={deals} />
        }

        return (
            <div id={"accountSidebar" + (this.props.isMobile ? "Mobile" : "")} className="container-fluid hidden-sm hidden-xs">
                <h3>Opportunities</h3>
                {contents}
                <AddAccountButton
                    btnClassName="btn-outline-secondary btn-block"
                    onSuccess={this.onSuccess}
                >
                    <i className="fa fa-plus">Create Account</i>
                </AddAccountButton>

            </div>
        )
    }
})
