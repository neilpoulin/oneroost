import React, { PropTypes } from 'react'
import ParseReact from 'parse-react';
import Parse from 'parse';
import BudgetForm from './../BudgetForm';

const TimelineSidebar = React.createClass({
  mixins: [ParseReact.Mixin],
  observe(){
    var dealQuery = (new Parse.Query("Deal")).equalTo('objectId', this.props.params.dealId);
    return {
      deal: dealQuery
    };
  },
  render(){
    if (this.pendingQueries() > 0) {
      return (
        <i className="fa fa-spin fa-spinner">Loading Deal</i>
      );
    }

    var deal = this.data.deal[0];

    return (
      <div className="TimelineSidebar">
        <h3 className="title">Budget</h3>
        <BudgetForm deal={deal}/>
      </div>
    )
  }
});

export default TimelineSidebar
