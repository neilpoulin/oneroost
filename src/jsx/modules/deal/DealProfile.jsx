import React, { PropTypes } from "react"
import NavLink from "NavLink";
import * as RoostUtil from "RoostUtil"

const DealProfile = React.createClass({
    propTypes: {
        deal: PropTypes.object.isRequired,
        stakeholders: PropTypes.arrayOf(PropTypes.object),
        documents: PropTypes.arrayOf(PropTypes.object),
        requirements: PropTypes.arrayOf(PropTypes.object),
    },
    getDefaultProps(){
        return {
            stakeholders: [],
            documents: [],
            requirements: [],
        }
    },
    getBudgetString(){
        var {deal} = this.props;
        return RoostUtil.getBudgetString(deal)
    },
    render () {
        const {deal, stakeholders, documents, requirements} = this.props;
        var widgetClassName = "widget"
        var titleClassName = "col-xs-2 widget"
        var iconSizeClassname = "fa-lg"
        const dealId = deal.objectId
        const {profile={}, dealName} = deal
        var budget = this.getBudgetString()

        let activeStakeholders = stakeholders.filter(s => s.active !== false);
        var stakeholderCount = activeStakeholders.length
        var documentCount = documents.length

        let completedRequirements = requirements.filter(requirement => {
            return requirement.completedDate != null && requirement.active
        })

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
                        <NavLink tag="div" to={"/roosts/" + dealId + "/requirements" } className="widgetLink">
                            <div>
                                <i className={"fa fa-list-alt " + iconSizeClassname}></i>
                                &nbsp; Requirements
                            </div>
                            <div>
                                <span className="title">{completedRequirements.length} / {requirements.length}</span>
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
