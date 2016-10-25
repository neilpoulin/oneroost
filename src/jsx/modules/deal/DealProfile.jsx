import React, { PropTypes } from "react"
import Parse from "parse";
import ParseReact from "parse-react";
import NavLink from "./../NavLink";
import RoostUtil from "./../util/RoostUtil"

const DealProfile = React.createClass({
    mixins: [ParseReact.Mixin],
    propTypes: {
        deal: PropTypes.object.isRequired
    },
    observe(props, state){
        var stakeholderQuery = new Parse.Query("Stakeholder");
        stakeholderQuery.equalTo("deal", props.deal);

        return {
            stakeholders: stakeholderQuery,
            documents: (new Parse.Query("Document")).equalTo( "deal", props.deal )
        }
    },
    getBudgetString(){
        var deal = this.props.deal;
        var budget = deal.budget;
        if (!budget) {
            return "Not Quoted";
        }
        if (budget.low == budget.high) {
            if (budget.low > 0) {
                return RoostUtil.formatMoney(budget.low, true);
            }
            return "Not Quoted";
        }
        return RoostUtil.formatMoney(budget.low, true) + " - " + RoostUtil.formatMoney(budget.high, false);
    },
    render () {
        var deal = this.props.deal
        var widgetClassName = "widget"
        var titleClassName = "col-xs-2 widget"
        var iconSizeClassname = "fa-lg"
        var budget = this.getBudgetString()

        var stakeholderCount = ""
        var documentCount = 0
        if (this.pendingQueries().length == 0) {
            stakeholderCount = this.data.stakeholders.length > 0 ? this.data.stakeholders.length : ""
            documentCount = this.data.documents.length
        }

        var formattedRoostAge = RoostUtil.formatDurationAsDays( deal.createdAt )
        // var stage = Stages.get(deal.currentStage) || Stages.get("EXPLORE");
        var dealTitleBlock =
        <div className={titleClassName}>
            <h1>
                {deal.dealName}
            </h1>
        </div>;

        dealTitleBlock = null;

        var dealProfile =
        <div className="DealProfile">
            {dealTitleBlock}
            <div className="widgetContainer">
                <div className={widgetClassName}>
                    <div className="text-center">
                        <NavLink tag="div" to={"/roosts/" + deal.objectId + "/budget" } className="widgetLink">
                            <div>
                                <i className={"fa fa-money " + iconSizeClassname}></i>
                                &nbsp; Investment
                            </div>
                            <div>
                                <span className="title">{budget}</span>
                            </div>
                        </NavLink>
                    </div>
                </div>
                <div className={widgetClassName}>
                    <div className={"text-center " + (deal.profile.timeline ? "" : "invisible")}>
                        <NavLink tag="div" to={"/roosts/" + deal.objectId + "/timeline" } className="widgetLink">
                            <div>
                                <i className={"fa fa-calendar " + iconSizeClassname}></i>
                                &nbsp; Opportunity Created
                            </div>
                            <div>
                                <span className="title">{formattedRoostAge}</span>
                            </div>

                        </NavLink>
                    </div>
                </div>
                <div className={widgetClassName}>
                    <div className="text-center">
                        <NavLink tag="div" to={"/roosts/" + deal.objectId + "/participants" } className="widgetLink">
                            <div>
                                <i className={"fa fa-users " + iconSizeClassname}></i>
                                    &nbsp; Participants
                            </div>
                            <div>
                                <span className="title">{stakeholderCount}</span>
                            </div>
                        </NavLink>
                    </div>
                </div>
                <div className={widgetClassName}>
                    <div className="text-center">
                        <NavLink tag="div" to={"/roosts/" + deal.objectId + "/documents" } className="widgetLink">
                            <div>
                                <i className={"fa fa-files-o " + iconSizeClassname}></i>
                                    &nbsp; Documents
                            </div>
                            <div>
                                <span className="title">{documentCount}</span>
                            </div>
                        </NavLink>
                    </div>
                </div>
            </div>
        </div>
        return dealProfile;
    }
});

export default DealProfile
