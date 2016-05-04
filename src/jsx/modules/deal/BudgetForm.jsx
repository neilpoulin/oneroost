import React, { PropTypes } from "react"
import ParseReact from "parse-react";
import LinkedStateMixin from "react-addons-linked-state-mixin";

const TimelineSidebar = React.createClass({
    mixins: [LinkedStateMixin],
    propTypes: {
        deal: PropTypes.object.isRequired
    },
    getInitialState(){
        return {
            high: this.props.deal.budget.high || 0,
            low: this.props.deal.budget.low || 0
        }
    },
    doSubmit(){
        var deal = this.props.deal;
        var budget = {high: this.state.high, low: this.state.low};
        var setter = ParseReact.Mutation.Set(deal, {budget: budget});
        setter.dispatch();
    },
    render(){
        var timelineSidebar =
        <div className="TimelineSidebar">
            <div className="form-group">
                <label>High</label>
                <input className="form-control" valueLink={this.linkState("high")}/>
            </div>
            <div className="form-group">
                <label>Low</label>
                <input className="form-control" valueLink={this.linkState("low")}/>
            </div>
            <button className="btn btn-primary" onClick={this.doSubmit}>Save</button>
        </div>

        return timelineSidebar;
    }
});

export default TimelineSidebar
