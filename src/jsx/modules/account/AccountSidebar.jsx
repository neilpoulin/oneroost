import React from "react"
import Parse from "parse"
import AccountSidebarList from "account/AccountSidebarList"
import AddAccountButton from "account/AddAccountButton"

export default React.createClass({
    getInitialState(){
        return {
            stakeholders: [],
            loading: true,
        }
    },
    componentWillMount(){
        let self = this;
        var user = Parse.User.current();
        var stakeholdersQuery = new Parse.Query("Stakeholder");
        stakeholdersQuery.include("deal");
        stakeholdersQuery.include(["deal.account"]);
        stakeholdersQuery.include("deal.createdBy");
        stakeholdersQuery.include("deal.readyRoostUser");
        stakeholdersQuery.equalTo("user", user );
        stakeholdersQuery.equalTo("inviteAccepted", true);

        stakeholdersQuery.find().then(stakeholders => {
            self.setState({
                stakeholders: stakeholders,
                loading: false
            })
        })
    },
    getDefaultProps: function(){
        return {
            isMobile: false
        }
    },
    onSuccess: function(){
        
    },
    render () {
        var contents;
        if ( this.state.loading ){
            contents = <div>Loading....</div>;
        }
        else {
            var deals = this.state.stakeholders.map(function(stakeholder){
                    return stakeholder.get("deal")
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
