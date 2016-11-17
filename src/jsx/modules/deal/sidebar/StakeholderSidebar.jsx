import React, { PropTypes } from "react"
import AddStakeholderButton from "./../AddStakeholderButton";
import ParseReact from "parse-react";
import Parse from "parse";
import Stakeholder from "./../Stakeholder";

const StakeholderSidebar = React.createClass({
    mixins: [ParseReact.Mixin],
    propTypes: {
        params: PropTypes.object
    },
    getInitialState(){
        return {
            isEdit: false
        }
    },
    observe: function () {
        var Deal = Parse.Object.extend("Deal");
        var deal = new Deal();
        deal.id = this.props.params.dealId;
        var dealQuery = (new Parse.Query("Deal")).equalTo("objectId", this.props.params.dealId);
        var stakeholderQuery = new Parse.Query("Stakeholder");
        stakeholderQuery.include("user");
        stakeholderQuery.include("invitedBy");
        stakeholderQuery.ascending("role");
        stakeholderQuery.equalTo("deal", deal);
        return {
            deal: dealQuery,
            stakeholders: stakeholderQuery
        }
    },
    refreshStakeholders()
    {
        this.refreshQueries(["stakeholders"]);
    },
    toggleEditStakeholders(){
        this.setState({isEdit: !this.state.isEdit});
    },

    render () {
        if (this.pendingQueries() > 0) {
            return (
                <i className="fa fa-spin fa-spinner">Loading Stakeholders</i>
            )
        }
        var deal = this.data.deal[0];
        var isEdit = this.state.isEdit;
        var actionButton = <button className="btn btn-outline-secondary" onClick={this.toggleEditStakeholders}><i className="fa fa-minus"></i>&nbsp;Remove</button>
        if ( isEdit ){
            actionButton = <button className="btn btn-secondary" onClick={this.toggleEditStakeholders}><i className="fa fa-check"></i>&nbsp;Done</button>
        }


        return (
            <div className="StakeholderSidebar">
                <h3 className="title">Participants</h3>
                <div className="stakeholder-actions">
                    {actionButton}
                    <AddStakeholderButton deal={deal}
                        btnClassName={"btn-primary btn-block " + (isEdit ? "disabled" : null)}
                        onSuccess={this.refreshStakeholders}/>
                </div>
                <div>
                    {this.data.stakeholders.map(function (stakeholder) {
                        return (
                            <Stakeholder key={"stakeholder_" + stakeholder.objectId} stakeholder={stakeholder} isEdit={isEdit}/>
                        )
                    })}
                </div>
            </div>
        )
    }
});

export default StakeholderSidebar
