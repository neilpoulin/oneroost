import React, { PropTypes } from "react"
import Parse from "parse"
import ParseReact from "parse-react";
import LinkedStateMixin from "react-addons-linked-state-mixin";
import AutosizeTextarea from "react-textarea-autosize";

const TimelineSidebar = React.createClass({
    mixins: [LinkedStateMixin],
    propTypes: {
        deal: PropTypes.object.isRequired
    },
    getInitialState(){
        return {
            high: this.props.deal.budget.high || 0,
            low: this.props.deal.budget.low || 0,
            description: this.props.deal.description || null
        }
    },
    doSubmit(){
        var deal = this.props.deal;
        var budget = {high: this.state.high, low: this.state.low};
        var setter = ParseReact.Mutation.Set(deal, {
            budget: budget,
            description: this.state.description
        });
        setter.dispatch().then(this.sendComment);
    },
    sendComment( deal )
    {
        var user = Parse.User.current();
        var message = user.get("firstName") + " " + user.get("lastName") + " updated the Investment Details";
        var comment = {
            deal: deal,
            message: message,
            author: null,
            username: "OneRoost Bot",
            navLink: {type: "investment"}
        };
        ParseReact.Mutation.Create("DealComment", comment).dispatch();
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

            <div className="form-group">
                <label >Product / Service</label>
                <AutosizeTextarea
                    className="form-control"
                    maxRows={15}
                    minRows={4}
                    ref="textInput"
                    onChange={e => this.setState({description: e.target.value})}
                    value={this.state.description}
                    ></AutosizeTextarea>
            </div>


            <button className="btn btn-primary" onClick={this.doSubmit}>Save</button>
        </div>

        return timelineSidebar;
    }
});

export default TimelineSidebar