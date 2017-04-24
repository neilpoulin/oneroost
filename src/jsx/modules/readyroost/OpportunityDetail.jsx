import React, { PropTypes } from "react"
import FormUtil, {Validation} from "./../util/FormUtil"
import FormInputGroup from "FormInputGroup"
import * as log from "LoggingUtil"
import FormSelect from "FormSelectGroup"
import {getSubCategoryOptions} from "TemplateUtil"

const OpportunityDetail = React.createClass({
    propTypes: {
        readyRoostUser: PropTypes.object.isRequired,
        currentUser: PropTypes.object,
        nextStep: PropTypes.func.isRequired,
        previousStep: PropTypes.func.isRequired,
        saveValues: PropTypes.func.isRequired,
        previousText: PropTypes.string,
        nextText: PropTypes.string,
        tempalte: PropTypes.object,
    },
    validations: {
        company: new Validation(FormUtil.notNullOrEmpty, "error", "Please enter your company name"),
        subCategory: new Validation(FormUtil.notNullOrEmpty, "error", "Please choose a product / service"),
        // problem: new Validation(FormUtil.notNullOrEmpty, "error", "Please briefly describe the problem you are trying to solve"),
    },
    getDefaultProps: function(){
        return {
            previousText: "Previous Step",
            nextText: "Next Step"
        }
    },
    getInitialState(){
        return {
            company: this.props.fieldValues.company,
            problem: this.props.fieldValues.problem,
            subCategory: this.props.fieldValues.subCategory,
            errors: {}
        }
    },
    nextStep(){
        var errors = FormUtil.getErrors(this.state, this.validations);
        log.info(errors);
        if (Object.keys(errors).length === 0 && errors.constructor === Object){
            this.setState({errors: {}});
            this.props.saveValues({
                company: this.state.company,
                subCategory: this.state.subCategory,
            });
            this.props.nextStep();
            return true;
        }
        else {
            log.info("failed validation");
        }
        this.setState({errors: errors});
    },    
    render () {
        let {errors, company, subCategory} = this.state;
        const {template} = this.props
        let page =
        <div>
            <div className="lead">
                The most successful business offerings solve a major pain point for a company. Describe what problem your offering is solving for {this.props.readyRoostUser.comapny} below.
            </div>
            <div>
                <FormInputGroup
                    fieldName="company"
                    label="Your Company"
                    errors={errors}
                    value={company}
                    required={true}
                    onChange={val => this.setState({"company": val})}
                    />

                <FormSelect
                    fieldName="subCategory"
                    label="Product / Service Type"
                    errors={errors}
                    value={subCategory ? subCategory.value : null}
                    requred={true}
                    options={getSubCategoryOptions(template.industryCategory, template.industry).toList().toJS()}
                    onChange={selection => this.setState({subCategory: selection})}
                    />

            </div>
            <div className="actions">
                <button className="btn btn-outline-secondary" onClick={this.props.previousStep}>Previous Step</button>
                <button className="btn btn-primary" onClick={this.nextStep}>{this.props.nextText}</button>
            </div>
        </div>
        return page
    }
})

export default OpportunityDetail
