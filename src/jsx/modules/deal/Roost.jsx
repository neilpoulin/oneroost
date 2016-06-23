import React, { PropTypes } from "react"
import {withRouter} from "react-router"
import Parse from "parse";
Parse.serverURL = OneRoost.Config.parseSeverURL;
import ParseReact from "parse-react";
import LoadingTakeover from "./../util/LoadingTakeover";
import NextStepsBanner from "./../nextsteps/NextStepsBanner";
import DealProfile from "./DealProfile";
import DealPageBottom from "./DealPageBottom";

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

        }
        else {
            this.props.router.replace('/roosts/unauthorized')
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
            if (!stakeholders || !stakeholders.find( s => s.deal.objectId == dealId ) )
            {
                this.handleUnauthorized();
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

        var dealPage =
        <div className="Deal">
            <div
                className="container-fluid"
                id="dealPageContainer">
                <div className="dealContainer col-md-10 col-md-offset-2 container-fluid">
                    <div className="row-fluid">
                        <div className="deal-top hidden-xs">
                            <DealProfile deal={deal} />
                            <NextStepsBanner deal={deal} />
                        </div>
                    </div>
                    <div className="row-fluid">
                        <DealPageBottom ref="dealPageBottom" deal={deal}>
                            {this.props.children}
                        </DealPageBottom>
                    </div>
                </div>
            </div>
        </div>

        return dealPage;
    }
}) )

export default Deal
