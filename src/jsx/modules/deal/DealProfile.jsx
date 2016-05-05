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
            stakeholders: stakeholderQuery
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
                return this.formatMoney(budget.low, false);
            }
            return "Not Quoted";
        }
        return this.formatMoney(budget.low, false) + " - " + this.formatMoney(budget.high, false);
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
        var iconSizeClassname = "fa-lg";
        var budget = this.getBudgetString();

        var stakeholderCount = "";
        if (this.pendingQueries().length == 0) {
            stakeholderCount = this.data.stakeholders.length > 0 ? this.data.stakeholders.length : "";
        }

        var dealProfile =
        <div className="DealProfile container-fluid">
            <div className="row">
                <div className={widgetClassName}>
                    <h1>
                        {deal.dealName}
                    </h1>
                </div>
                <div className={widgetClassName}>
                    <div className="row text-center">
                        <NavLink tag="div" to={"/deals/" + deal.objectId + "/budget" } className="widgetLink">
                            <div>
                                <i className={"fa fa-usd " + iconSizeClassname}></i>
                                &nbsp; Budget
                            </div>
                            <div>
                                <span className="title">{budget}</span>
                            </div>
                        </NavLink>
                    </div>
                </div>
                <div className={widgetClassName}>
                    <div className={"row text-center " + (deal.profile.timeline ? "" : "invisible")}>
                        <NavLink tag="div" to={"/deals/" + deal.objectId + "/timeline" } className="widgetLink">
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
                        <NavLink tag="div" to={"/deals/" + deal.objectId + "/participants" } className="widgetLink">
                            <div>
                                <i data-badge={stakeholderCount} className={"fa icon-badge fa-user " + iconSizeClassname}></i>
                                    &nbsp; Participants
                            </div>
                            <div>
                                <span className="title">{stakeholderCount}</span>
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
