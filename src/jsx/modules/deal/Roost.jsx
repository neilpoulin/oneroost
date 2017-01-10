import React, { PropTypes } from "react"
import {withRouter} from "react-router"
import Parse from "parse";
Parse.serverURL = OneRoost.Config.parseSeverURL;
import LoadingTakeover from "LoadingTakeover";
import NextStepsBanner from "nextsteps/NextStepsBanner";
import DealProfile from "DealProfile";
import DealNavMobile from "DealNavMobile";
import DealPageBottom from "DealPageBottom";
import AccountSidebar from "account/AccountSidebar";
import RoostNav from "RoostNav";
import RoostUtil from "RoostUtil";
import {Pointer} from "models/Models";
import {updateById} from "SubscriptionUtil"

const Roost = withRouter( React.createClass({
    propTypes: {
        params: PropTypes.shape({
            dealId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
        })
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
        const self = this;
        let dealSubscription = queries.deal.subscribe();
        dealSubscription.on("update", deal => {
            self.setState({deal: deal});
        });

        let stepSubscription = queries.steps.subscribe();
        stepSubscription.on("create", step => {
            let steps = self.state.nextSteps;
            steps.push(step);
            self.setState({nextSteps: steps});
        });

        stepSubscription.on("update", step => {
            let steps = self.state.nextSteps;
            updateById(steps, step);
            self.setState({nextSteps: steps});
        })

        let stakeholderSubscription = queries.stakeholders.subscribe();
        stakeholderSubscription.on("create", stakeholder => {
            let stakeholders = self.state.stakeholders;
            stakeholders.push(stakeholder);
            self.setState({stakeholders: stakeholders});
        });
        stakeholderSubscription.on("update", stakeholder => {
            let stakeholders = self.state.stakeholders;
            updateById(stakeholders, stakeholder);
            self.setState({stakeholders: stakeholders});
        })

        let documentSubscription = queries.documents.subscribe();
        documentSubscription.on("create", document => {
            let documents = self.state.documents;
            documents.push(document);
            self.setState({documents: documents});
        })

        let opportunitiesSubscription = queries.opportunities.subscribe();
        opportunitiesSubscription.on("create", stakeholder => {
            let opportunity = stakeholder.get("deal");
            let opportunities = self.state.opportunities;
            opportunities.push(opportunity);
            self.setState({opportunities: opportunities});
        })

        this.subscriptions = {
            deal: dealSubscription,
            steps: stepSubscription,
            stakeholders: stakeholderSubscription,
            documents: documentSubscription,
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
        let self = this;
        let dealQuery = new Parse.Query("Deal");
        dealQuery.include("readyRoostUser");
        dealQuery.include("createdBy");
        dealQuery.include("account");
        dealQuery.get(dealId).then(deal => {
            var dealName = RoostUtil.getRoostDisplayName(deal);
            document.title = dealName + " | OneRoost";
            self.setState({
                deal: deal,
                dealLoading: false
            });
        }).catch(error => {
            console.error(error);
        });


        let deal = Pointer("Deal", dealId);
        var stakeholderQuery = new Parse.Query("Stakeholder");
        stakeholderQuery.equalTo("deal", deal);
        stakeholderQuery.include("user");
        stakeholderQuery.find().then(stakeholders => {
            self.setState({
                stakeholdersLoading: false,
                stakeholders: stakeholders
            });
        }).catch(error => console.error(error));


        let stepQuery = new Parse.Query("NextStep")
        stepQuery.equalTo( "deal", deal);
        stepQuery.ascending("dueDate");
        stepQuery.find().then(steps => {
            self.setState({
                nextSteps: steps,
                nextStepsLoading: false
            });
        }).catch(error => console.error(error));

        let documentsQuery = new Parse.Query("Document");
        documentsQuery.equalTo( "deal", deal )
        documentsQuery.include("user")
        documentsQuery.include("createdBy")
        documentsQuery.find().then(documents => {
            self.setState({
                documentsLoading: false,
                documents: documents,
            });
        });

        var opportunitiesQuery = new Parse.Query("Stakeholder");
        opportunitiesQuery.include("deal");
        opportunitiesQuery.include(["deal.account"]);
        opportunitiesQuery.include("deal.createdBy");
        opportunitiesQuery.include("deal.readyRoostUser");
        opportunitiesQuery.equalTo("user", Parse.User.current() );
        opportunitiesQuery.equalTo("inviteAccepted", true);
        opportunitiesQuery.find().then(stakeholders => {
            let opportunities = stakeholders.map(s => s.get("deal"));
            self.setState({
                opportunities: opportunities,
                loading: false
            });
        })

        let queries = {
            documents: documentsQuery,
            steps: stepQuery,
            stakeholders: stakeholderQuery,
            deal: dealQuery,
            opportunities: opportunitiesQuery,
        }
        this.setupSubscriptions(queries)
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
        let {deal,
            nextSteps,
            stakeholders,
            dealLoading,
            documents,
            opportunities,
            documentsLoading,
            stakeholdersLoading,
            nextStepsLoading} = this.state;

            if ( dealLoading || stakeholdersLoading || nextStepsLoading || documentsLoading)
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

            // var childrenWithProps = null;
            // if ( this.props.children ){
            //     childrenWithProps = React.cloneElement(this.props.children, {
            //         deal: deal,
            //         nextSteps: nextSteps,
            //         stakeholders: stakeholders
            //     });
            // }
            // var mobileClassesDealTop = "visible-lg visible-md";
            var mobileClassesDealTop = "hidden-sm hidden-xs";
            var dealPage =
            <div className="RoostPage">
                <RoostNav mobileTitle={deal.get("dealName")} showHome={true}/>
                <div className="RoostBody">
                    <AccountSidebar deals={opportunities}/>
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

    export default Roost
