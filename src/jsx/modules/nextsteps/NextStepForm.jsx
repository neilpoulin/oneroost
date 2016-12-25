import React from "react"
import Parse from "parse"
import ParseReact from "parse-react"
import moment from "moment"
import Dropdown from "./../stakeholder/Dropdown"
import AutosizeTextarea from "react-textarea-autosize"
import FormUtil, {Validation} from "./../util/FormUtil"
import RoostUtil from "./../util/RoostUtil"
import {linkState} from "./../util/LinkState"
import DateTakeoverButton from "./../util/DateTakeoverButton"

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
    validations: {
        "title": new Validation(FormUtil.notNullOrEmpty, "error", "A title is reqired"),
        "dueDate": [
            new Validation(FormUtil.isValidDate, "error", "A due date is required"),
            new Validation(FormUtil.notBefore, "error", "The due date can not be in the past.")
        ]
    },
    doSubmit: function () {
        var errors = this.getValidationErrors();
        console.log(errors);
        if ( Object.keys(errors).length === 0 && errors.constructor === Object ){
            this.saveNextStep();
            return true;
        }
        this.setState({errors: errors});
        return false;
    },
    getValidationErrors(){
        var errors = FormUtil.getErrors(this.state, this.validations)
        return errors;
    },
    saveNextStep: function () {
        var self = this;
        debugger;
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
    getErrorClass(field){
        var errors = this.state.errors;
        if (errors[field] )
        {
            return "has-" + errors[field].level
        }
        else return null;
    },
    getErrorHelpMessage(field){
        var errors = this.state.errors;
        if ( errors[field] )
        {
            var error = errors[field];
            return <span key={"nextStep_error_" + field} className="help-block">{error.message}</span>
        }
        return null
    },
    render: function () {
        var form =
        <div className="NextStepsFormContainer">
            <div className={"form-group " + this.getErrorClass("title")}>
                <label htmlFor="nextStepTitle" className="control-label">Title</label>
                <input id="nextStepTitle"
                    type="text"
                    className="form-control"
                    value={this.state.title}
                    onChange={linkState(this,"title")}/>
                {this.getErrorHelpMessage("title")}
            </div>
            <div className="form-group">
                <label htmlFor="nextStepDescription" className="control-label">Description</label>
                    <AutosizeTextarea
                        className="form-control"
                        maxRows={10}
                        minRows={4}
                        onChange={e => this.setState({description: e.target.value})}
                        value={this.state.description}
                        >
                    </AutosizeTextarea>
            </div>
            <div className={"form-group " + this.getErrorClass("dueDate")}>
                <label htmlFor="nextStepDueDate" className="control-label">Due Date</label>
                <div className="form-control-static">
                    {RoostUtil.formatDate(this.state.dueDate)}
                    <DateTakeoverButton onChange={this.handleDateChange}
                        buttonText="edit"
                        buttonClass="link"
                        buttonType="span"
                        selectedDate={this.state.dueDate}
                        />
                </div>

                {this.getErrorHelpMessage("dueDate")}
            </div>
            <div className="form-group">
                <label htmlFor="nextStepAssignedUser" className="control-label">Assigned User</label>

                <Dropdown deal={this.props.deal} handleChange={this.handleUserChange}/>

            </div>
        </div>
        return form;
    }
});
