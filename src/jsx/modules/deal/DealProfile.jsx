import React, { PropTypes } from "react"
import NavLink from "NavLink";
import RoostUtil from "RoostUtil"

const DealProfile = React.createClass({
    propTypes: {
        deal: PropTypes.object.isRequired,
        stakeholders: PropTypes.arrayOf(PropTypes.object),
        documents: PropTypes.arrayOf(PropTypes.object),
    },
    getDefaultProps(){
        return {
            stakeholders: [],
            documents: []
        }
    },
    getBudgetString(){
        var {deal} = this.props;
        var budget = deal.budget
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
        const {deal, stakeholders, documents} = this.props;
        var widgetClassName = "widget"
        var titleClassName = "col-xs-2 widget"
        var iconSizeClassname = "fa-lg"
        const dealId = deal.objectId
        const {profile={}, createdAt, dealName} = deal
        var budget = this.getBudgetString()

        let activeStakeholders = stakeholders.filter(s => s.active !== false);
        var stakeholderCount = activeStakeholders.length > 0 ? activeStakeholders.length : ""
        var documentCount = documents.length > 0 ? documents.length : ""

        var formattedRoostAge = RoostUtil.formatDurationAsDays( createdAt )

        var dealTitleBlock =
        <div className={titleClassName}>
            <h1>
                {dealName}
            </h1>
        </div>;

        dealTitleBlock = null;

        var dealProfile =
        <div className="DealProfile">
            {dealTitleBlock}
            <div className="widgetContainer">
                <div className={widgetClassName}>
                    <div className="text-center">
                        <NavLink tag="div" to={"/roosts/" + dealId + "/budget" } className="widgetLink">
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
                    <div className={"text-center " + (profile.timeline ? "" : "invisible")}>
                        <NavLink tag="div" to={"/roosts/" + dealId + "/timeline" } className="widgetLink">
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
                        <NavLink tag="div" to={"/roosts/" + dealId + "/participants" } className="widgetLink">
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
                        <NavLink tag="div" to={"/roosts/" + dealId + "/documents" } className="widgetLink">
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
