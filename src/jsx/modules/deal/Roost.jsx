import React, { PropTypes } from "react"
import {withRouter} from "react-router"
import Parse from "parse";
Parse.serverURL = OneRoost.Config.parseSeverURL;
import ParseReact from "parse-react";
import LoadingTakeover from "./../util/LoadingTakeover";
import NextStepsBanner from "./../nextsteps/NextStepsBanner";
import DealProfile from "./DealProfile";
import DealNavMobile from "./DealNavMobile";
import DealPageBottom from "./DealPageBottom";
import AccountSidebar from "./../account/AccountSidebar";
import RoostNav from "./../navigation/RoostNav";

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
        return {
            deal: new Parse.Query("Deal").equalTo("objectId", props.params.dealId ),
            myStakeholders: stakeholders
        }
    },
    componentWillUpdate(nextProps, nextState)
    {
        var dealId = nextProps.params.dealId;
        if ( this.pendingQueries().length == 0 )
        {
            var stakeholders = this.data.myStakeholders;

            var foundStakeholder = stakeholders.find( s => s.deal.objectId == dealId );
            if (!stakeholders || !foundStakeholder )
            {
                this.handleUnauthorized();
            }
            else if ( !foundStakeholder.inviteAccepted )
            {
                this.props.router.replace("/invitations/" + foundStakeholder.objectId)
            }
        }
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
        var dealName = this.data.deal[0].dealName;
        document.title = "OneRoost - " + dealName;
        var childrenWithProps = null;
        if ( this.props.children ){
            childrenWithProps = React.cloneElement(this.props.children, {deal: deal});
        }
        // var mobileClassesDealTop = "visible-lg visible-md";
        var mobileClassesDealTop = "hidden-sm hidden-xs";
        var dealPage =
        <div className="RoostPage">
            <RoostNav deal={deal}/>
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
