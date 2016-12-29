import React from "react"
import Parse from "parse"
import ParseReact from "parse-react"
import moment from "moment"
import Dropdown from "./../stakeholder/Dropdown"
import FormUtil from "./../util/FormUtil"
import RoostUtil from "./../util/RoostUtil"
import DateTakeoverButton from "./../util/DateTakeoverButton"
import FormInputGroup from "./../form/FormInputGroup"
import AutosizeTextAreaFormGroup from "./../form/AutosizeTextAreaFormGroup"
import FormGroup from "./../form/FormGroup"
import {validations} from "./NextStepValidations"

export default React.createClass({
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
        var self = this;
        var step = {
            "createdBy": this.state.createdBy,
            "title": this.state.title,
            "description": this.state.description,
            "dueDate": this.state.dueDate.toDate(),
            "assignedUser": this.state.assignedUser,
            "deal": this.state.deal,
            "completedDate": this.state.completedDate ? new Date(this.state.completedDate) : null
        };
        ParseReact.Mutation.Create("NextStep", step)
        .dispatch()
        .then(function (step) {
            self.addStepCreatedComment(step);
        });
        self.clear();
    },
    addStepCreatedComment: function (step) {
        var self = this;
        var message = self.state.user.get("firstName") + " " + self.state.user.get("lastName") + " created Next Step: " + step.title;
        var comment = {
            deal: self.state.deal,
            message: message,
            author: null,
            username: "OneRoost Bot",
            navLink: {type: "step", id: step.objectId }
        };
        ParseReact.Mutation.Create("DealComment", comment).dispatch();
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
            user = {className: "_User", objectId: val.value}

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
                <Dropdown deal={this.props.deal} handleChange={this.handleUserChange} value={this.props.assignedUser != null ? this.props.step.assignedUser.objectId : null}/>
            </FormGroup>
        </div>
        return form;
    }
});
