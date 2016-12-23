import React, { PropTypes } from "react"
import Parse from "parse"
import ParseReact from "parse-react"
import {linkState} from "./../util/linkState"
import AutosizeTextarea from "react-textarea-autosize"

const TimelineSidebar = React.createClass({
    propTypes: {
        deal: PropTypes.object.isRequired
    },
    getInitialState(){
        return {
            high: this.props.deal.budget.high || 0,
            low: this.props.deal.budget.low || 0,
            description: this.props.deal.description || "",
            saveSuccess: false,
            saveError: false,
            dealName: this.props.deal.dealName
        }
    },
    doSubmit(){
        var self = this;
        var deal = this.props.deal;
        var budget = {high: this.state.high, low: this.state.low};
        var setter = ParseReact.Mutation.Set(deal, {
            budget: budget,
            description: this.state.description,
            dealName: this.state.dealName
        });
        setter.dispatch().then(this.sendComment);
        self.showSuccess();
    },
    showSuccess(){
        var self = this;
        self.setState({saveSuccess: true});
        setTimeout(function(){
            self.setState({saveSuccess: false});
        }, 2000);
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
        return ParseReact.Mutation.Create("DealComment", comment).dispatch();
    },
    render(){
        var saveMessage = null;
        var saveClass = null
        if ( this.state.saveSuccess ){
            saveMessage = <div className="help-block">Success <i className="fa fa-check"></i></div>
            saveClass = "has-success";
        }

        var timelineSidebar =
        <div className="InvestmentForm">
            <div className="form-inline-half">
                <div className="form-group">
                    <label>Low</label>
                    <div className="input-group">
                        <span className="input-group-addon" id="basic-addon1">$</span>
                        <input type="number"
                            className="form-control"
                            placeholder=""
                            aria-describedby="basic-addon1"
                            value={this.state.low}
                            onChange={linkState(this, "low")}/>
                    </div>
                </div>
                <div className="form-group">
                    <label>High</label>
                    <div className="input-group">
                        <span className="input-group-addon" id="basic-addon1">$</span>
                        <input type="number"
                            className="form-control"
                            placeholder=""
                            aria-describedby="basic-addon1"
                            value={this.state.high}
                            onChange={linkState(this, "high")}/>
                    </div>
                </div>
            </div>
            <div className="form-group">
                <label >Problem Summary</label>
                <input type="text" className="form-control"
                    placeholder=""
                    aria-describedby="basic-addon1"
                    value={this.state.dealName}
                    onChange={linkState(this, "dealName")}
                    maxLength={40}/>
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

            <div className={"form-group " + saveClass}>
                <button className="btn btn-outline-primary btn-block" onClick={this.doSubmit}>Save</button>
                {saveMessage}
            </div>

        </div>

        return timelineSidebar;
    }
});

export default TimelineSidebar
