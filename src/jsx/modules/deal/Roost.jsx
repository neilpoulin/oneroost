import React, { PropTypes } from "react"
import {withRouter} from "react-router"
import { connect } from "react-redux"
import Parse from "parse"
Parse.serverURL = OneRoost.Config.parseSeverURL
import LoadingTakeover from "LoadingTakeover"
import DealProfile from "DealProfile"
import DealNavMobile from "DealNavMobile"
import DealPageBottom from "DealPageBottom"
import AccountSidebar from "account/AccountSidebar"
import RoostNav from "RoostNav"
// import * as RoostUtil from "RoostUtil"
import SubmitReadyRoostComponent from "readyroost/SubmitReadyRoostComponent"
import {loadDeal} from "ducks/roost/roost"
import {loadNextSteps, subscribeNextSteps} from "ducks/roost/nextSteps"
import {loadDocuments} from "ducks/roost/documents"
import {loadStakeholders} from "ducks/roost/stakeholders"
import {loadOpportunities, subscribeOpportunities, getUserDealsByName} from "ducks/opportunities"
import {loadRequirements, subscribeRequirements} from "ducks/roost/requirements"
import {denormalize} from "normalizr"
import {Map, List} from "immutable"
import * as Deal from "models/Deal"
import * as Stakeholder from "models/Stakeholder"
import * as Document from "models/Document"
import * as NextStep from "models/NextStep"
import * as Requirement from "models/Requirement"
import * as log from "LoggingUtil"
import {sortDatesAscending} from "DateUtil"
import EmptyState from "EmptyState"

const NO_ROOSTS = "NO_ROOSTS"

const Roost = withRouter(React.createClass({
    propTypes: {
        params: PropTypes.shape({
            dealId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
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
    handleUnauthorized() {
        const { location } = this.props;
        if (location.state && location.state.nextPathname) {
            this.props.router.replace(location.state.nextPathname)
        }
        else if (location.query && location.query.accept){
            //what to do here...
            log.info("unauthorized - has accept query params though.");
        }
        else {
            this.props.router.replace("/roosts/unauthorized")
        }
    },
    componentWillMount(){
        let paramDealId = this.props.params.dealId;
        let {dealId, dealLoading} = this.props
        if (paramDealId){
            this.getData(paramDealId);
        }
        else if (dealId){
            this.props.router.replace(`/roosts/${dealId}`)
        }
        else {
            this.props.loadOpportunities();
        }
    },
    componentWillUpdate(nextProps, nextState) {
        let self = this;
        if (nextProps.error){
            return;
        }
        // let {params} = nextProps;
        // let {dealId=self.props.params.dealId} = params;
        var dealId = nextProps.params.dealId || this.props.params.dealId;
        if (!dealId && nextProps.dealId){
            this.props.router.replace(`/roosts/${nextProps.dealId}`)
            return
        }

        document.title = (nextProps.deal ? nextProps.deal.dealName : "Opportunities") + " | OneRoost"
        Parse.Cloud.run("validateStakeholder", {
            dealId: dealId
        }).then(({message, authorized, stakeholder}) => {
            if (!authorized){
                self.handleUnauthorized();
                return;
            }

            if (!stakeholder.inviteAccepted && stakeholder.readyRoostApprover){
                self.props.router.replace("/review/" + stakeholder.objectId)
            }
            else if (!stakeholder.inviteAccepted) {
                self.props.router.replace("/invitations/" + stakeholder.objectId)
            }
        });

        if (nextProps.params.dealId !== this.props.params.dealId){
            this.resetLoading();
            this.getData(nextProps.params.dealId || this.props.params.dealId);
        }
    },
    getData(dealId){
        log.info("setting up roost queries and subscriptions");
        // let self = this;
        if (this.props.loadData) {
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
            dealId,
            stakeholders,
            nextSteps,
            documents,
            dealLoading,
            requirements,
            opportunities,
            error} = this.props;

        // <NextStepsBanner deal={deal} stakeholders={stakeholders} nextSteps={nextSteps} />
        var mobileClassesDealTop = "hidden-sm hidden-xs";
        var dealPage =
            <div className="RoostPage">
                <RoostNav mobileTitle={deal ? deal.dealName : null} showHome={true}/>
                <LoadingTakeover size="3x" message={"Loading..."} display-if={dealLoading} />
                <EmptyState display-if={error}
                    className="container text-center"
                    message="Oops, it looks like you don't have any opportunities yet."
                    link={{text: "Go to My Settings", path: "/settings/company"}}
                    />
                <div className="RoostBody" display-if={!dealLoading && !error && deal}>
                    <AccountSidebar deals={opportunities.deals} archivedDeals={opportunities.archivedDeals}/>
                    <div className="Deal">
                        <div className="deal-top">
                            <div className={mobileClassesDealTop}>
                                <SubmitReadyRoostComponent dealId={dealId}/>
                                <DealProfile deal={deal} stakeholders={stakeholders} documents={documents} requirements={requirements}/>
                            </div>
                            <DealNavMobile deal={deal}></DealNavMobile>
                        </div>
                        <div className="dealPageBottomContainer">
                            <DealPageBottom ref="dealPageBottom"
                                nextSteps={nextSteps}
                                stakeholders={stakeholders}
                                deal={deal}
                                documents={documents}
                                requirements={requirements}
                                sidebar={this.props.children}
                                >
                            </DealPageBottom>
                        </div>
                    </div>
                </div>
            </div>

        return dealPage;
    }
}))

const mapStateToProps = (state, ownProps) => {
    const entities = state.entities.toJS()
    const roosts = state.roosts.toJS()
    // TODO: get the first value as sorted by... something
    let userId = state.user.get("userId")
    let opportunitesLoaded = state.opportunitiesByUser.getIn([userId, "hasLoaded"], false)
    if (opportunitesLoaded){
        let deals = state.opportunitiesByUser.getIn([userId, "deals"], List())
        if (deals.isEmpty()){
            return {
                error: {
                    type: NO_ROOSTS
                },
                dealLoading: false,
            }
        }
    }
    else {
        return {
            dealLoading: true,
        };
    }

    if (!entities || !entities.deals){
        log.info("entitites not loaded yet");
        return {};
    }
    let deals = entities.deals;
    if(!deals){
        log.warn("failed to get deals key");
        return {
            dealLoading: true,
        };
    }

    let dealId = ownProps.params.dealId || ownProps.params.dealId
    if (!dealId){
        const sortedDeals = getUserDealsByName(state)
        dealId = sortedDeals.first() ? sortedDeals.first().objectId : null
    }
    let deal = deals[dealId]
    let roost = roosts[dealId]
    let error = null
    if (!deal || !roost || roost && roost.dealLoading){
        return {
            dealLoading: true,
            dealId,
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
        ).filter(step => step.active !== false)
        .sort((a, b) => sortDatesAscending(a.dueDate, b.dueDate))

    let requirements = denormalize(
        roost.requirements.ids,
            [Requirement.Schema],
        entities
        ).filter(requirement => requirement.active !== false)

    return Map({
        deal: deal,
        dealId: dealId,
        stakeholders: stakeholders,
        documents: documents,
        nextSteps: nextSteps,
        requirements: requirements,
        error: error,
    }).toJS()
}

const mapDispatchToProps = (dispatch, ownProps) => {
        // let dealId = ownProps.params.dealId;
    const currentUser = Parse.User.current()
    const userId = currentUser.id
    return {
        loadData: (dealId) => {
            if (dealId){
                dispatch(loadDeal(dealId))
                dispatch(loadNextSteps(dealId))
                dispatch(loadDocuments(dealId))
                dispatch(loadStakeholders(dealId))
                dispatch(subscribeNextSteps(dealId))
                dispatch(loadRequirements(dealId))
                dispatch(subscribeRequirements(dealId))
            }
            dispatch(loadOpportunities(userId))
            dispatch(subscribeOpportunities(userId))
        },
        loadOpportunities: () => {
            dispatch(loadOpportunities(userId))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Roost)
