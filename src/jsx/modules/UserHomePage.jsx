import Parse from "parse"
import React from "react"
import { withRouter } from "react-router"
import RoostNav from "navigation/RoostNav"
import AddAccountButton from "account/AddAccountButton"
import AccountSidebarList from "account/AccountSidebarList"
import BetaUserWelcome from "BetaUserWelcome"
import {updateById, removeItem} from "SubscriptionUtil"

const UserHomePage = React.createClass({
    getInitialState(){
        return {
            stakeholders: [],
            loading: true
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
    componentWillUnmount(){
        this.removeSubscriptions();
    },
    componentWillMount(){
        this.fetchData();
    },
    componentWillUpdate(){
        console.log("UserHomePage component will update");
    },
    subscriptions: {},
    setupSubscriptions(queries){
        const self = this;
        let stakeholdersSubscription = queries.stakeholders.subscribe();
        stakeholdersSubscription.on("create", stakeholder => {
            let stakeholders = self.state.stakeholders;
            stakeholders.push(stakeholder);
            self.setState({stakeholders: stakeholders});
        });

        stakeholdersSubscription.on("update", stakeholder => {
            let stakeholders = self.state.stakeholders;
            updateById(stakeholders, stakeholder)
            self.setState({stakeholders: stakeholders});
        });

        stakeholdersSubscription.on("enter", stakeholder => {
            let stakeholders = self.state.stakeholders;
            stakeholders.push(stakeholder);
            self.setState({stakeholders: stakeholders});
        });

        stakeholdersSubscription.on("leave", stakeholder => {
            let stakeholders = self.state.stakeholders;
            removeItem(stakeholders, stakeholder)
            self.setState({stakeholders: stakeholders});
        });

        this.subscriptions = {
            stakeholders: stakeholdersSubscription
        }
    },
    removeSubscriptions(){
        console.log("removing subscriptions");
        const subscriptions = this.subscriptions;
        for (const name in this.subscriptions ){
            if ( subscriptions.hasOwnProperty(name)){
                subscriptions[name].unsubscribe()
            }
        }
    },
    fetchData(){
        const self = this;
        this.removeSubscriptions();
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

        let queries = {
            stakeholders: stakeholdersQuery
        }
        this.setupSubscriptions(queries);
    },
    render(){
        let contents = null;
        if ( this.state.loading ){
            contents =
            <div>
                <i className="fa fa-spin fa-spinner"></i>
                {" Loading..."}
            </div>
        }
        else
        {
            var deals = this.state.stakeholders.map(function(stakeholder){
                return stakeholder.get("deal")
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
});

export default withRouter( UserHomePage );
