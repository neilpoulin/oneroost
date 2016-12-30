import React, { PropTypes } from "react"
import Parse from "parse"
import ParseReact from "parse-react"
import AutosizeTextAreaFormGroup from "AutosizeTextAreaFormGroup"
import FormInputGroup from "FormInputGroup"
import InvestmentValidation from "InvestmentValidation"
import FormUtil from "FormUtil"

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
            dealName: this.props.deal.dealName,
            errors: {},
        }
    },
    doSubmit(){
        var self = this;
        let errors = FormUtil.getErrors(this.state, InvestmentValidation);
        if ( !FormUtil.hasErrors(errors) ){
            this.setState({errors: {}});
            var deal = this.props.deal;
            var budget = {high: this.state.high, low: this.state.low};
            var setter = ParseReact.Mutation.Set(deal, {
                budget: budget,
                description: this.state.description,
                dealName: this.state.dealName
            });
            setter.dispatch().then(this.sendComment);
            self.showSuccess();

            return true;
        }
        this.setState({errors: errors});
        return false;
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
        var saveClass = "";
        let {errors} = this.state;
        if ( this.state.saveSuccess ){
            saveMessage = <div className="help-block">Success <i className="fa fa-check"></i></div>
            saveClass = "has-success";
        }

        var timelineSidebar =
        <div className="InvestmentForm">
            <div className="form-inline-half">
                <FormInputGroup
                    label="Low"
                    fieldName="low"
                    value={this.state.low}
                    errors={errors}
                    type="number"
                    onChange={val => this.setState({low: val})}
                    addonBefore={"$"}
                    />

                <FormInputGroup
                    label="High"
                    fieldName="high"
                    value={this.state.high}
                    errors={errors}
                    type="number"
                    onChange={val => this.setState({high: val})}
                    addonBefore={"$"}
                    />
            </div>

            <FormInputGroup
                label="Problem Summary"
                fieldName="dealName"
                value={this.state.dealName}
                errors={errors}
                onChange={val => this.setState({dealName: val})}
                />

            <AutosizeTextAreaFormGroup
                label="Product / Service"
                fieldName="description"
                value={this.state.description}
                errors={errors}
                maxRows={15}
                minRows={4}
                onChange={val => this.setState({description: val})}
                />

            <div className={saveClass}>
                <button className="btn btn-outline-primary btn-block" onClick={this.doSubmit}>Save</button>
                {saveMessage}
            </div>

        </div>

        return timelineSidebar;
    }
});

export default TimelineSidebar
