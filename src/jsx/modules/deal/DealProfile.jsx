import React, { PropTypes } from "react"
import Parse from "parse";
import NavLink from "NavLink";
import RoostUtil from "RoostUtil"

const DealProfile = React.createClass({
    propTypes: {
        deal: PropTypes.instanceOf(Parse.Object).isRequired,
        stakeholders: PropTypes.arrayOf(PropTypes.instanceOf(Parse.Object)),
        documents: PropTypes.arrayOf(PropTypes.instanceOf(Parse.Object)),
    },
    getDefaultProps(){
        return {
            stakeholders: [],
            documents: []
        }
    },
    // componentWillMount(){
    //     const self = this;
    //     const {deal} = this.props;
    //
    //     var stakeholderQuery = new Parse.Query("Stakeholder");
    //     stakeholderQuery.equalTo("deal", deal.id);
    //     stakeholderQuery.find().then(stakeholders => {
    //         self.setState({
    //             stakeholdersLoading: false,
    //             stakeholders: stakeholders.map(stakeholder => stakeholder.toJSON())
    //         });
    //     });
    //
    //     const documentsQuery = new Parse.Query("Document");
    //     documentsQuery.equalTo( "deal", deal.id )
    //     documentsQuery.find().then(documents => {
    //         self.setState({
    //             documentsLoading: false,
    //             documents: documents.map(doc => doc.toJSON())
    //         });
    //     });
    // },
    getBudgetString(){
        var {deal} = this.props;
        var budget = deal.get("budget");
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
        var budget = this.getBudgetString()

        var stakeholderCount = stakeholders.length > 0 ? stakeholders.length : ""
        var documentCount = documents.length > 0 ? documents.length : ""

        var formattedRoostAge = RoostUtil.formatDurationAsDays( deal.createdAt )
        // var stage = Stages.get(deal.currentStage) || Stages.get("EXPLORE");
        var dealTitleBlock =
        <div className={titleClassName}>
            <h1>
                {deal.get("dealName")}
            </h1>
        </div>;

        dealTitleBlock = null;

        var dealProfile =
        <div className="DealProfile">
            {dealTitleBlock}
            <div className="widgetContainer">
                <div className={widgetClassName}>
                    <div className="text-center">
                        <NavLink tag="div" to={"/roosts/" + deal.id + "/budget" } className="widgetLink">
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
                    <div className={"text-center " + (deal.get("profile").timeline ? "" : "invisible")}>
                        <NavLink tag="div" to={"/roosts/" + deal.id + "/timeline" } className="widgetLink">
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
                        <NavLink tag="div" to={"/roosts/" + deal.id + "/participants" } className="widgetLink">
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
                        <NavLink tag="div" to={"/roosts/" + deal.id + "/documents" } className="widgetLink">
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
