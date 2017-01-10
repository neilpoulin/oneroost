import React, { PropTypes } from "react"
import Parse from "parse";
import InvestmentForm from "InvestmentForm";

const InvestmentSidebar = React.createClass({
  propTypes: {
    deal: PropTypes.instanceOf(Parse.Object)
  },
  render(){
    var {deal} = this.props;
    return (
      <div className="InvestmentSidebar">
        <h3 className="title">Investment</h3>
        <InvestmentForm deal={deal}/>
      </div>
    )
  }
});

export default InvestmentSidebar
