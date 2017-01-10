import React, { PropTypes } from "react"
import Parse from "parse"
import DealComment from "models/DealComment"
import AutosizeTextAreaFormGroup from "AutosizeTextAreaFormGroup"
import FormInputGroup from "FormInputGroup"
import InvestmentValidation from "InvestmentValidation"
import FormUtil from "FormUtil"
import RoostUtil from "RoostUtil"

const TimelineSidebar = React.createClass({
    propTypes: {
        deal: PropTypes.instanceOf(Parse.Object).isRequired
    },
    getInitialState(){
        return {
            high: this.props.deal.get("budget").high || 0,
            low: this.props.deal.get("budget").low || 0,
            description: this.props.deal.get("description") || "",
            saveSuccess: false,
            saveError: false,
            dealName: this.props.deal.get("dealName"),
            errors: {},
        }
    },
    doSubmit(){
        var self = this;
        let errors = FormUtil.getErrors(this.state, InvestmentValidation);
        if ( !FormUtil.hasErrors(errors) ){
            this.setState({errors: {}});
            var {deal} = this.props;
            var budget = {high: this.state.high, low: this.state.low};

            deal.set("budget", budget);
            deal.set("description", this.state.description);
            deal.set("dealName", this.state.dealName);

            deal.save().then(this.sendComment).catch(error => console.error(error));
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
        var message = RoostUtil.getFullName(user) + " updated the Investment Details";
        let comment = new DealComment();
        comment.set({
            deal: deal,
            message: message,
            author: null,
            username: "OneRoost Bot",
            navLink: {type: "investment"}
        });
        comment.save().catch(error => console.error);

    },
    render(){
        var saveMessage = null;
        var saveClass = "";
        let {errors, saveSuccess} = this.state;
        if ( saveSuccess ){
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
