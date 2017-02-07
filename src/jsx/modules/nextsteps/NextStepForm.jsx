import React, {PropTypes} from "react"
import Parse from "parse"
import {connect} from "react-redux"
import moment from "moment"
import Dropdown from "stakeholder/Dropdown"
import FormUtil from "FormUtil"
import * as RoostUtil from "RoostUtil"
import DateTakeoverButton from "DateTakeoverButton"
import FormInputGroup from "FormInputGroup"
import AutosizeTextAreaFormGroup from "AutosizeTextAreaFormGroup"
import FormGroup from "FormGroup"
import {validations} from "nextsteps/NextStepValidations"
import {Pointer} from "models/modelUtil"
import {createNextStep} from "ducks/nextSteps"

const NextStepForm = React.createClass({
    propTypes: {
        stakeholders: PropTypes.array,
        deal: PropTypes.object.isRequired
    },
    getInitialState: function () {
        return {
            title: "",
            description: "",
            dueDate: moment(),
            createdBy: Parse.User.current(),
            assignedUser: null,
            deal: this.props.deal,
            completedDate: "",
            user: Parse.User.current(),
            errors: {}
        };
    },
    doSubmit: function () {
        var errors = FormUtil.getErrors(this.state, validations)
        console.log(errors);
        if ( Object.keys(errors).length === 0 && errors.constructor === Object ){
            this.saveNextStep();
            return true;
        }
        this.setState({errors: errors});
        return false;
    },
    saveNextStep: function () {
        let data = {
            createdBy: this.state.createdBy,
            title: this.state.title,
            description: this.state.description,
            dueDate: this.state.dueDate.toDate(),
            assignedUser: this.state.assignedUser,
            deal: this.props.deal,
            completedDate: this.state.completedDate ? new Date(this.state.completedDate) : null,
            author: this.state.createdBy,
        }
        this.props.createNextStep(data);
    },
    clear: function () {
        this.setState(this.getInitialState());
    },
    handleDateChange(date){
        this.setState({
            dueDate: date
        });
    },
    handleUserChange(val){
        var user = null;
        if (val != null) {
            user = Pointer("_User", val.value)
        }
        this.setState({
            assignedUser: user
        });
    },
    render: function () {
        var form =
        <div className="NextStepsFormContainer">
            <FormInputGroup
                label="Title"
                errors={this.state.errors}
                fieldName="title"
                value={this.state.title}
                onChange={val => this.setState({title: val})}/>

            <AutosizeTextAreaFormGroup
                label="Description"
                errors={this.state.errors}
                fieldName="description"
                maxRows={10}
                minRows={4}
                value={this.state.description}
                onChange={val => this.setState({description: val})} />

            <FormGroup
                label="Due Date"
                errors={this.state.errors}
                fieldName="dueDate"
                >
                <div className="form-control-static">
                    {RoostUtil.formatDate(this.state.dueDate)}
                    <DateTakeoverButton onChange={this.handleDateChange}
                        buttonText="edit"
                        buttonClass="link"
                        buttonType="span"
                        selectedDate={this.state.dueDate.toDate()}/>
                </div>
            </FormGroup>

            <FormGroup
                label="Assigned User"
                errors={this.state.errors}
                fieldName="assignedUser" >
                <Dropdown stakeholders={this.props.stakeholders}
                    deal={this.props.deal}
                    handleChange={this.handleUserChange}
                    value={this.props.assignedUser != null ? this.props.step.assignedUser.objectId : null}/>
            </FormGroup>
        </div>
        return form;
    }
});


const mapStateToProps = (state, ownProps) => {
    return {

    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        createNextStep: (step) => dispatch(createNextStep(step))
    }
}

const connectOpts = {
    withRef: true
}

export default connect(mapStateToProps, mapDispatchToProps, undefined, connectOpts)(NextStepForm)
