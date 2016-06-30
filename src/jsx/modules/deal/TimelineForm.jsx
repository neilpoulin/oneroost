import React, { PropTypes } from "react"
import Parse from "parse";
import ParseReact from "parse-react";
var DatePicker = require("react-datepicker");
var moment = require("moment");

const TimelineForm = React.createClass({
  mixins: [ParseReact.Mixin],
  observe(){
    return {};
  },
  propTypes: {
      timeline: PropTypes.string
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
    deal.profile.timeline = this.state.timeline.format();

    var setter = ParseReact.Mutation.Set(deal, {profile: deal.profile});
    setter.dispatch().then(this.sendComment);
  },
  sendComment( deal )
  {
      var user = Parse.User.current();
      var message = user.get("firstName") + " " + user.get("lastName") + " updated the Timeline";
      var comment = {
          deal: deal,
          message: message,
          author: null,
          username: "OneRoost Bot",
          navLink: {type: "timeline"}
      };
      ParseReact.Mutation.Create("DealComment", comment).dispatch();
  },
  render(){
    return (
      <div className="TimelineForm">
        <div className="form-group">
          <DatePicker
            selected={this.state.timeline}
            onChange={this.handleChange}
            className="form-control"
          />
        </div>
        <button className="btn btn-primary" onClick={this.doSubmit}>Save</button>
      </div>
    )
  }
});

export default TimelineForm
