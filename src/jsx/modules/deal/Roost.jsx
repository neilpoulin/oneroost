import React, { PropTypes } from "react"
import {withRouter} from "react-router"
import { connect } from "react-redux"
import Parse from "parse";
Parse.serverURL = OneRoost.Config.parseSeverURL;
import LoadingTakeover from "LoadingTakeover";
import NextStepsBanner from "nextsteps/NextStepsBanner";
import DealProfile from "DealProfile";
import DealNavMobile from "DealNavMobile";
import DealPageBottom from "DealPageBottom";
import AccountSidebar from "account/AccountSidebar";
import RoostNav from "RoostNav";
// import RoostUtil from "RoostUtil";
// import {updateById} from "SubscriptionUtil"
import {loadDeal} from "ducks/roost"
import {loadNextSteps} from "ducks/nextSteps"
import {loadDocuments} from "ducks/documents"
import {loadStakeholders} from "ducks/stakeholders"
import {loadOpportunities} from "ducks/opportunities"
import {denormalize} from "normalizr"
import {Map, List} from "immutable"
import * as Deal from "models/Deal"
import * as Stakeholder from "models/Stakeholder"
import * as Document from "models/Document"
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
    subscriptions: {},
    setupSubscriptions(queries){
        // const self = this;
        // let dealSubscription = queries.deal.subscribe();
        // dealSubscription.on("update", deal => {
        //     self.setState({deal: deal});
        // });

        // let stepSubscription = queries.steps.subscribe();
        // stepSubscription.on("create", step => {
        //     let steps = self.state.nextSteps;
        //     steps.push(step);
        //     self.setState({nextSteps: steps});
        // });
        //
        // stepSubscription.on("update", step => {
        //     let steps = self.state.nextSteps;
        //     updateById(steps, step);
        //     self.setState({nextSteps: steps});
        // })

        // let stakeholderSubscription = queries.stakeholders.subscribe();
        // stakeholderSubscription.on("create", stakeholder => {
        //     let stakeholders = self.state.stakeholders;
        //     stakeholders.push(stakeholder);
        //     self.setState({stakeholders: stakeholders});
        // });
        // stakeholderSubscription.on("update", stakeholder => {
        //     let stakeholders = self.state.stakeholders;
        //     updateById(stakeholders, stakeholder);
        //     self.setState({stakeholders: stakeholders});
        // })

        // let documentSubscription = queries.documents.subscribe();
        // documentSubscription.on("create", document => {
        //     let documents = self.state.documents;
        //     documents.push(document);
        //     self.setState({documents: documents});
        // })

        // let opportunitiesSubscription = queries.opportunities.subscribe();
        // opportunitiesSubscription.on("create", stakeholder => {
        //     let opportunity = stakeholder.get("deal");
        //     let opportunities = self.state.opportunities;
        //     opportunities.push(opportunity);
        //     self.setState({opportunities: opportunities});
        // })

        this.subscriptions = {
            // deal: dealSubscription,
            // steps: stepSubscription,
            // stakeholders: stakeholderSubscription,
            // documents: documentSubscription,
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
    componentWillMount(){
        let {dealId} = this.props.params;
        this.getData(dealId);
    },
    componentWillUnmount(){
        this.removeSubscriptions()
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
            this.getData(nextProps.params.dealId);
        }

    },
    getData(dealId){
        console.log("setting up roost queries and subscriptions");
        this.removeSubscriptions();
        // let self = this;
        if (this.props.loadData ) {
            this.props.loadData();
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

            if ( dealLoading || this.props.stakeholders.get("isLoading") || this.props.nextSteps.get("isLoading") || this.props.documents.get("isLoading") )
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
                <RoostNav mobileTitle={deal.get("dealName")} showHome={true}/>
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
                                nextStepIds={this.props.nextSteps.ids}
                                stakeholders={stakeholders}
                                stakeholderIds={this.props.stakeholders.ids}
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
        console.log("Roost logging state", Map(state).toJS());
        const currentUser = Parse.User.current()
        let userId = currentUser.id;
        const dealId = ownProps.params.dealId;
        const {entities, roosts} = state;
        if ( !entities || !entities.has("deals") ){
            console.log("entitites not loaded yet");
            return {};
        }
        let deals = entities.get("deals");
        if( !deals ){
            console.warn("failed to get deals key");
            return {dealLoading: true};
        }
        let deal = deals.get(dealId);
        let roost = roosts.get(dealId)
        if ( !roost || !deal || roost.get("dealLoading") ){
            return {
                dealLoading: true,
            }
        }

        let stakeholders = denormalize(
            roost.get("stakeholders").get("ids"),
            [Stakeholder.Schema],
            state.entities.toJS()
        )
        stakeholders = List(stakeholders.map(Map))

        let documents = denormalize(
            roost.get("documents").get("ids"),
            [Document.Schema],
            state.entities.toJS()
        ).map(Map)

        let opportunities = Map({
            isLoading: false,
            deals: [],
            archivedDeals: []
        })
        let myOpportunities = state.opportunitiesByUser.get(userId)
        if ( myOpportunities ){
            let deals = denormalize(myOpportunities.get("deals").toJS(), [Deal.Schema], state.entities.toJS())
            let archivedDeals = denormalize(myOpportunities.get("archivedDeals").toJS(), [Deal.Schema], state.entities.toJS() )
            opportunities.set("deals", List(deals.map(Map)))
            opportunities.set("archivedDeals", List(archivedDeals.map(Map)))
        }


        return {
            deal,
            opportunities,
            stakeholders,
            documents,
        }
    }

    const mapDispatchToProps = (dispatch, ownProps) => {
        const dealId = ownProps.params.dealId;
        const currentUser = Parse.User.current()
        return {
            loadData: () => {
                dispatch(loadDeal(dealId))
                dispatch(loadNextSteps(dealId))
                dispatch(loadDocuments(dealId))
                dispatch(loadStakeholders(dealId))
                dispatch(loadOpportunities(currentUser.id))
            }
        }
    }

    export default connect(mapStateToProps, mapDispatchToProps)(Roost)
