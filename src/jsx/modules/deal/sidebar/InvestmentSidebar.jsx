import React, { PropTypes } from "react"
import ParseReact from "parse-react";
import Parse from "parse";
import InvestmentForm from "InvestmentForm";

const InvestmentSidebar = React.createClass({
  mixins: [ParseReact.Mixin],
  propTypes: {
    params: PropTypes.shape({dealId: PropTypes.any}).isRequired,

  },
  observe(props, state){
    var dealQuery = (new Parse.Query("Deal")).equalTo("objectId", props.params.dealId);
    return {
      deal: dealQuery
    };
  },
  render(){
    if (this.pendingQueries().length > 0) {
      return (
        <span><i className="fa fa-spin fa-spinner"></i>Loading Deal...</span>
      );
    }

    var deal = this.data.deal[0];

    return (
      <div className="InvestmentSidebar">
        <h3 className="title">Investment</h3>
        <InvestmentForm deal={deal}/>
      </div>
    )
  }
});

export default InvestmentSidebar
