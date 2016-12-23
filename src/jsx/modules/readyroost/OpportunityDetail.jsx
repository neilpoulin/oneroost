import React, { PropTypes } from "react"
import FormUtil, {Validation} from "./../util/FormUtil"
import {linkState} from "./../util/LinkState"

const OpportunityDetail = React.createClass({
    propTypes: {
        readyRoostUser: PropTypes.object.isRequired,
        currentUser: PropTypes.object,
        nextStep: PropTypes.func.isRequired,
        previousStep: PropTypes.func.isRequired,
        saveValues: PropTypes.func.isRequired,
        previousText: PropTypes.string,
        nextText: PropTypes.string
    },
    validations: {
        company: new Validation(FormUtil.notNullOrEmpty, "error", "Please enter your company name"),
        problem: new Validation(FormUtil.notNullOrEmpty, "error", "Please briefly describe the problem you are trying to solve"),
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
            errors: {}
        }
    },
    nextStep(){
        var errors = FormUtil.getErrors(this.state, this.validations);
        console.log(errors);
        if ( Object.keys(errors).length === 0 && errors.constructor === Object ){
            this.setState({errors: {}});
            this.props.saveValues({
                company: this.state.company,
                problem: this.state.problem
            });
            this.props.nextStep();
            return true;
        }
        this.setState({errors: errors});
    },
    render () {
        let page =
        <div>
            <div className="lead">
                The most successful business offerings solve a major pain point for a company. Describe what problem your offering is solving for {this.props.readyRoostUser.comapny} below.
            </div>
            <div>
                <div className={"form-group " + FormUtil.getErrorClass("company", this.state.errors)}>
                    <label htmlFor="companyInput" className="control-label">Company</label>
                    <input id="companyInput"
                        type="text"
                        className="form-control"
                        value={this.state.company}
                        onChange={linkState(this,"company")}/>
                    {FormUtil.getErrorHelpMessage("company", this.state.errors)}
                </div>
                <div className={"form-group " + FormUtil.getErrorClass("problem", this.state.errors)}>
                    <label htmlFor="problemInput" className="control-label">Problem Summary</label>
                    <input id="problemInput"
                        type="text"
                        maxLength={40}
                        className="form-control"
                        value={this.state.problem}
                        onChange={linkState(this,"problem")}/>
                    {FormUtil.getErrorHelpMessage("problem", this.state.errors)}
                </div>
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
