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
  render () {
    if (this.pendingQueries() > 0) {
      return (
        <i className="fa fa-spin fa-spinner">Loading Stakeholders</i>
      )
    }
    var deal = this.data.deal[0];

    return (
      <div className="StakeholderSidebar">
        <h3 className="title">Participants</h3>
        {this.data.stakeholders.map(function (stakeholder) {
          return (
            <Stakeholder key={"stakeholder_" + stakeholder.objectId} stakeholder={stakeholder}/>
          )
        })}
        <AddStakeholderButton deal={deal}
                              btnClassName="btn-outline-primary btn-block"
                              onSuccess={this.refreshStakeholders}/>
      </div>
    )
  }
});

export default StakeholderSidebar
