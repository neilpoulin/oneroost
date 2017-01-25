import React, { PropTypes } from "react"
import Parse from "parse"
import AutosizeTextAreaFormGroup from "AutosizeTextAreaFormGroup"
import FormInputGroup from "FormInputGroup"
import InvestmentValidation from "InvestmentValidation"
import FormUtil from "FormUtil"
import RoostUtil from "RoostUtil"

const InvestmentForm = React.createClass({
    propTypes: {
        deal: PropTypes.object.isRequired,
        updateDeal: PropTypes.func.isRequired
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
        let errors = FormUtil.getErrors(this.state, InvestmentValidation);
        if ( !FormUtil.hasErrors(errors) ){
            this.setState({errors: {}});
            var budget = {high: this.state.high, low: this.state.low};
            var user = Parse.User.current();
            let message = RoostUtil.getFullName(user) + " updated the Investment Details";
            this.props.updateDeal({
                budget: budget,
                description: this.state.description,
                dealName: this.state.dealName
            },message)

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

export default InvestmentForm
