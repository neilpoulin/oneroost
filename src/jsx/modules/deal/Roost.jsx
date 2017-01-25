import React, { PropTypes } from "react"
import {withRouter} from "react-router"
import { connect } from "react-redux"
import Parse from "parse"
Parse.serverURL = OneRoost.Config.parseSeverURL
import LoadingTakeover from "LoadingTakeover"
import NextStepsBanner from "nextsteps/NextStepsBanner"
import DealProfile from "DealProfile"
import DealNavMobile from "DealNavMobile"
import DealPageBottom from "DealPageBottom"
import AccountSidebar from "account/AccountSidebar"
import RoostNav from "RoostNav"
// import RoostUtil from "RoostUtil"

import {loadDeal} from "ducks/roost"
import {loadNextSteps} from "ducks/nextSteps"
import {loadDocuments} from "ducks/documents"
import {loadStakeholders} from "ducks/stakeholders"
import {loadOpportunities} from "ducks/opportunities"
import {denormalize} from "normalizr"
import {Map} from "immutable"
import * as Deal from "models/Deal"
import * as Stakeholder from "models/Stakeholder"
import * as Document from "models/Document"
import * as NextStep from "models/NextStep"
// import * as DealComment from "models/DealComment"


const Roost = withRouter( React.createClass({
    propTypes: {
        params: PropTypes.shape({
            dealId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
        }),
        deal: PropTypes.object,
        dealLoading: PropTypes.bool
    },
    getDefaultProps(){
        return {
            dealLoading: false,
            opportunities: {
                deals: [],
                archivedDeals: []
            },
            documents: [],
            stakeholders: []
        }
    },
    getInitialState(){
        return {
            deal: null,
            dealLoading: true,
            stakeholders: [],
            stakeholdersLoading: true,
            nextSteps: [],
            nextStepsLoading: true,
            documents: [],
            documentsLoading: true,
        }
    },
    handleUnauthorized()
    {
        const { location } = this.props;
        if (location.state && location.state.nextPathname) {
            this.props.router.replace(location.state.nextPathname)
        }
        else if ( location.query && location.query.accept ){
            //what to do here...
            console.log("unauthorized - has accept query params though.");
        }
        else {
            this.props.router.replace("/roosts/unauthorized")
        }
    },
    componentWillMount(){
        let {dealId} = this.props.params;
        this.getData(dealId);
    },
    componentWillUpdate(nextProps, nextState)
    {
        let self = this;
        // let {params} = nextProps;
        // let {dealId=self.props.params.dealId} = params;
        var dealId = nextProps.params.dealId || this.props.params.dealId;

        Parse.Cloud.run("validateStakeholder", {
            dealId: dealId
        }).then(({message, authorized, stakeholder}) => {
            console.log("validateStakeholder response", message);
            if ( !authorized ){
                self.handleUnauthorized();
                return;
            }

            if ( !stakeholder.inviteAccepted && stakeholder.readyRoostApprover ){
                self.props.router.replace("/review/" + stakeholder.objectId)
            }
            else if ( !stakeholder.inviteAccepted )
            {
                self.props.router.replace("/invitations/" + stakeholder.objectId)
            }
        });

        if ( nextProps.params.dealId !== this.props.params.dealId ){
            this.resetLoading();
            this.getData(nextProps.params.dealId || this.props.params.dealId);
        }

    },
    getData(dealId){
        console.log("setting up roost queries and subscriptions");
        // let self = this;
        if (this.props.loadData ) {
            this.props.loadData(dealId);
        }
    },
    resetLoading(){
        this.setState({
            stakeholdersLoading: true,
            nextStepsLoading: true,
            documentsLoading: true,
            dealLoading: true,
        });
    },
    render () {

        const {deal,
            stakeholders,
            nextSteps,
            documents,
            dealLoading,
            opportunities} = this.props;

            if ( dealLoading )
            {
                var message = "Loading...";
                return (
                    <LoadingTakeover size="3x" message={message} />
                );
            }

            if ( !deal )
            {
                return (
                    <div>ERROR</div>
                )
            }

            var mobileClassesDealTop = "hidden-sm hidden-xs";
            var dealPage =
            <div className="RoostPage">
                <RoostNav mobileTitle={deal.dealName} showHome={true}/>
                <div className="RoostBody">
                    <AccountSidebar deals={opportunities.deals} archivedDeals={opportunities.archivedDeals}/>
                    <div className="Deal">
                        <div className="deal-top">
                            <div className={mobileClassesDealTop}>
                                <NextStepsBanner deal={deal} stakeholders={stakeholders} nextSteps={nextSteps} />
                                <DealProfile deal={deal} stakeholders={stakeholders} documents={documents}/>
                            </div>
                            <DealNavMobile deal={deal}></DealNavMobile>
                        </div>
                        <div className="dealPageBottomContainer">
                            <DealPageBottom ref="dealPageBottom"
                                nextSteps={nextSteps}
                                stakeholders={stakeholders}
                                deal={deal}
                                documents={documents}
                                sidebar={this.props.children}
                                >
                            </DealPageBottom>
                        </div>
                    </div>
                </div>
            </div>


            return dealPage;
        }
    }) )

    const mapStateToProps = (state, ownProps) => {
        let stateJS = Map(state).toJS()
        console.log("Roost logging state", stateJS);
        const currentUser = Parse.User.current()
        const entities = stateJS.entities
        const roosts = stateJS.roosts
        let userId = currentUser.id;
        let dealId = ownProps.params.dealId
        if ( !entities || !entities.deals ){
            console.log("entitites not loaded yet");
            return {};
        }
        let deals = entities.deals;
        if( !deals ){
            console.warn("failed to get deals key");
            return {dealLoading: true};
        }
        let deal = deals[dealId]
        let roost = roosts[dealId]
        if ( !roost || !deal || roost.dealLoading ){
            return {
                dealLoading: true,
            }
        }
        deal = denormalize(dealId, Deal.Schema, entities)
        roost = roost
        let stakeholders = denormalize(
            roost.stakeholders.ids,
            [Stakeholder.Schema],
            entities
        )

        let documents = denormalize(
            roost.documents.ids,
            [Document.Schema],
            entities
        )

        let nextSteps = denormalize(
            roost.nextSteps.ids,
            [NextStep.Schema],
            entities
        )

        let opportunities = {
            isLoading: false,
            deals: [],
            archivedDeals: []
        }
        let myOpportunities = stateJS.opportunitiesByUser[userId]
        if ( myOpportunities ){
            opportunities.deals = denormalize(myOpportunities.deals, [Deal.Schema], entities)
            opportunities.archivedDeals = denormalize(myOpportunities.archivedDeals, [Deal.Schema], entities)
        }

        return Map({
            deal: deal,
            opportunities: opportunities,
            stakeholders: stakeholders,
            documents: documents,
            nextSteps: nextSteps,
        }).toJS()
    }

    const mapDispatchToProps = (dispatch, ownProps) => {
        // let dealId = ownProps.params.dealId;
        const currentUser = Parse.User.current()
        return {
            loadData: (dealId) => {
                dispatch(loadDeal(dealId))
                dispatch(loadNextSteps(dealId))
                dispatch(loadDocuments(dealId))
                dispatch(loadStakeholders(dealId))
                dispatch(loadOpportunities(currentUser.id))
            }
        }
    }

    export default connect(mapStateToProps, mapDispatchToProps)(Roost)
