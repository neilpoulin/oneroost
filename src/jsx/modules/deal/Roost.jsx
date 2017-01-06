import React, { PropTypes } from "react"
import {withRouter} from "react-router"
import Parse from "parse";
Parse.serverURL = OneRoost.Config.parseSeverURL;
import ParseReact from "parse-react";
import LoadingTakeover from "LoadingTakeover";
import NextStepsBanner from "nextsteps/NextStepsBanner";
import DealProfile from "DealProfile";
import DealNavMobile from "DealNavMobile";
import DealPageBottom from "DealPageBottom";
import AccountSidebar from "account/AccountSidebar";
import RoostNav from "RoostNav";
import RoostUtil from "RoostUtil"

const Deal = withRouter( React.createClass({
    mixins: [ParseReact.Mixin],
    propTypes: {
        params: PropTypes.shape({
            dealId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
        })
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
    observe: function(props, state){
        var user = Parse.User.current();
        var stakeholders = new Parse.Query("Stakeholder");
        stakeholders.include("deal");
        stakeholders.include(["deal.account"]);
        stakeholders.equalTo("user", user );

        let dealQuery = new Parse.Query("Deal");
        dealQuery.equalTo("objectId", props.params.dealId );
        dealQuery.include("readyRoostUser");
        dealQuery.include("createdBy");
        dealQuery.include("account")
        return {
            deal: dealQuery,
            myStakeholders: stakeholders
        }
    },
    componentDidUpdate(){
        if ( this.data.deal && this.data.deal[0] ){
            var deal = this.data.deal[0];
            var dealName = RoostUtil.getRoostDisplayName(deal);
            document.title = dealName + " | OneRoost";
        }
        else{
            document.title = "OneRoost";
        }

    },
    componentWillUpdate(nextProps, nextState)
    {
        var dealId = nextProps.params.dealId;
        const self = this;
        Parse.Cloud
        .run("validateStakeholder", {dealId: dealId})
        .then(({message, authorized, stakeholder}) => {
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
    },
    render () {
        if ( this.pendingQueries().length > 0 )
        {
            var message = "Loading...";
            return (
                <LoadingTakeover size="3x" message={message} />
            );
        }
        var deal = this.data.deal[0];
        if ( !deal )
        {
            return (
                <div>ERROR</div>
            )
        }

        var childrenWithProps = null;
        if ( this.props.children ){
            childrenWithProps = React.cloneElement(this.props.children, {deal: deal});
        }
        // var mobileClassesDealTop = "visible-lg visible-md";
        var mobileClassesDealTop = "hidden-sm hidden-xs";
        var dealPage =
        <div className="RoostPage">
            <RoostNav mobileTitle={deal.dealName} showHome={true}/>
            <div className="RoostBody">
                <AccountSidebar/>
                <div className="Deal">
                    <div className="deal-top">
                        <div className={mobileClassesDealTop}>
                            <NextStepsBanner deal={deal} />
                            <DealProfile deal={deal} />
                        </div>
                        <DealNavMobile deal={deal}></DealNavMobile>
                    </div>
                    <div className="dealPageBottomContainer">
                        <DealPageBottom ref="dealPageBottom" deal={deal}>
                            {childrenWithProps}
                        </DealPageBottom>
                    </div>
                </div>
            </div>
        </div>


        return dealPage;
    }
}) )

export default Deal
