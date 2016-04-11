import React, { PropTypes } from 'react'
import ParseReact from 'parse-react';
import Parse from 'parse';
var DatePicker = require('react-datepicker');
var moment = require('moment');

const TimelineForm = React.createClass({
  mixins: [ParseReact.Mixin],
  observe(){
    return {};
  },
  getInitialState(){
    return {
      timeline: moment(this.props.timeline)
    };
  },
  handleChange: function (date) {
    this.setState({
      timeline: date
    });
  },
  doSubmit(){
    var deal = this.props.deal;
    deal.profile.timeline = this.state.timeline;

    var setter = ParseReact.Mutation.Set(deal, {profile: deal.profile});
    setter.dispatch();
  },
  render(){
    return (
      <div>
        <DatePicker
          selected={this.state.timeline}
          onChange={this.handleChange}
          isClearable={true}
          className="form-control"
        />
        <br/>
        <button className="btn btn-primary" onClick={this.doSubmit}>Save</button>
      </div>
    )
  }
});

export default TimelineForm
