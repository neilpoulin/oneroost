import Parse from "parse"
import React from "react"
import { connect } from "react-redux"
import { withRouter } from "react-router"
import RoostNav from "navigation/RoostNav"
import AddAccountButton from "account/AddAccountButton"
import OpportunityList from "account/OpportunityList"
import BetaUserWelcome from "BetaUserWelcome"
import {loadOpportunities, subscribeOpportunities} from "ducks/opportunities"
import {denormalize} from "normalizr"
import * as Deal from "models/Deal"
import * as RoostUtil from "RoostUtil"
import * as log from "LoggingUtil"

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

    },
    componentWillMount(){
        if ( this.props.loadData ){
            this.props.loadData()
        }
    },
    componentWillUpdate(nextProps, nextState){
        log.info("UserHomePage component will update");
        if ( this.props.userId != nextProps.useId && this.props.loadData ){
            // this.props.loadData()
        }
    },
    render(){
        const {deals, archivedDeals, isLoading, userId, currentUser} = this.props

        let contents = null;
        if ( isLoading ){
            contents =
            <div>
                <i className="fa fa-spin fa-spinner"></i>
                {" Loading..."}
            </div>
        }
        else
        {
            if ( deals.length > 0){
                contents = <OpportunityList deals={deals} archivedDeals={archivedDeals} user={currentUser} className="bg-inherit"></OpportunityList>
            }
            else{
                contents = <BetaUserWelcome userId={userId} emailVerified={currentUser.emailVerified}/>
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

const mapStateToProps = (state, ownProps) => {
    const currentUser = RoostUtil.getCurrentUser(state)
    let userId = currentUser.objectId;
    let entities = state.entities.toJS()
    let myOpportunities = state.opportunitiesByUser.get(userId)
    let deals = []
    let archivedDeals = []
    let isLoading = true
    if ( myOpportunities ){
        myOpportunities = myOpportunities.toJS()
        isLoading = myOpportunities.isLoading;
        deals = denormalize( myOpportunities.deals, [Deal.Schema], entities)
        archivedDeals = denormalize( myOpportunities.deals, [Deal.Schema], entities)
    }
    return {
        deals: deals,
        archivedDeals: archivedDeals,
        isLoading: isLoading,
        userId,
        currentUser,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    const currentUser = Parse.User.current()
    const userId = currentUser.id
    return {
        loadData: () => {
            dispatch(loadOpportunities(userId))
            dispatch(subscribeOpportunities(userId))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)( withRouter( UserHomePage ));
