import React, { PropTypes } from "react"
import Parse from "parse";
import ParseReact from "parse-react";
import numeral from "numeral";
import moment from "moment";
import NavLink from "./../NavLink";

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
                return this.formatMoney(budget.low, true);
            }
            return "Not Quoted";
        }
        return this.formatMoney(budget.low, true) + " - " + this.formatMoney(budget.high, false);
    },
    formatMoney(amount, includeSymbol){
        var format = "($0[.]0a)";
        if (!includeSymbol) {
            format = "(0[.]0a)"
        }
        return numeral(amount).format(format);
    },
    formatDate(dateString){
        if (dateString != null && dateString != undefined) {
            return moment(dateString).format("MMM D, YYYY");
        }
        return null;
    },
    render () {
        var deal = this.props.deal;
        var widgetClassName = "col-xs-3 widget";
        var titleClassName = "col-xs-2 widget";
        var iconSizeClassname = "fa-lg";
        var budget = this.getBudgetString();

        var stakeholderCount = "";
        var documentCount = 0;
        if (this.pendingQueries().length == 0) {
            stakeholderCount = this.data.stakeholders.length > 0 ? this.data.stakeholders.length : "";
            documentCount = this.data.documents.length;
        }

        var dealProfile =
        <div className="DealProfile container-fluid">
            <div className="row">
                <div className={titleClassName}>
                    <h1>
                        {deal.dealName}
                    </h1>
                </div>
                <div className="widgetContainer container-fluid col-xs-10">
                    <div className={widgetClassName}>
                        <div className="row text-center">
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
                        <div className={"row text-center " + (deal.profile.timeline ? "" : "invisible")}>
                            <NavLink tag="div" to={"/roosts/" + deal.objectId + "/timeline" } className="widgetLink">
                                <div>
                                    <i className={"fa fa-calendar " + iconSizeClassname}></i>
                                    &nbsp; Timeline
                                </div>
                                <div>
                                    <span className="title">{this.formatDate(deal.profile.timeline)}</span>
                                </div>

                            </NavLink>
                        </div>
                    </div>
                    <div className={widgetClassName}>
                        <div className="row text-center">
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
                        <div className="row text-center">
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
        </div>

        return dealProfile;

    }
});

export default DealProfile
