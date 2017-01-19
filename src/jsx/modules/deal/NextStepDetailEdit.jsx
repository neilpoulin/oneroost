import React, { PropTypes } from "react"
import DealComment from "models/DealComment"
import Parse from "parse"
import NextStepActions from "NextStepActions"
import moment from "moment"
import Dropdown from "stakeholder/Dropdown"
import {Pointer} from "models/Models"
import DateTakeoverButton from "DateTakeoverButton"
import RoostUtil from "RoostUtil"
import FormUtil from "FormUtil"
import FormInputGroup from "FormInputGroup"
import AutosizeTextAreaFormGroup from "AutosizeTextAreaFormGroup"
import FormGroup from "FormGroup"
import {validations} from "nextsteps/NextStepValidations"

const NextStepDetailEdit = React.createClass({
    propTypes: {
        step: PropTypes.object.isRequired,
        deal: PropTypes.object.isRequired,
        afterSave: PropTypes.func.isRequired,
        afterDelete: PropTypes.func.isRequired,
        handleCancel: PropTypes.func.isRequired
    },
    getInitialState: function () {
        return {
            title: this.props.step.title,
            description: this.props.step.description,
            dueDate: moment(this.props.step.dueDate),
            assignedUser: this.props.step.assignedUser,
            deal: this.props.deal,
            completedDate: this.props.step.completedDate,
            user: Parse.User.current(),
            errors: {},
        };
    },
    handleSave: function(){
        var self = this;

        var errors = FormUtil.getErrors(this.state, validations)
        console.log(errors);
        if ( Object.keys(errors).length === 0 && errors.constructor === Object ){
            let step = this.props.step;
            step.set({
                "title": this.state.title,
                "description": this.state.description,
                "dueDate": this.state.dueDate.toDate(),
                "assignedUser": this.state.assignedUser,
                "deal": this.state.deal,
                "completedDate": this.state.completedDate != null ? new Date(this.state.completedDate) : null,
                "modifiedBy": this.state.user
            });

            step.save().then(self.addStepSavedComment).catch(error => console.error);
            self.clear();
            this.props.afterSave();
            return true;
        }
        this.setState({errors: errors});
        return false;
    },
    addStepSavedComment: function (step) {
        var self = this;
        var user = Parse.User.current()

        let comment = new DealComment();
        comment.set({
            deal: self.props.deal,
            message: RoostUtil.getFullName(user) + " updated the details of Next Step: " + step.title,
            author: null,
            username: "OneRoost Bot",
            navLink: {type: "step", id: step.id}
        })
        comment.save().catch(error => console.error);
    },
    clear: function () {
        this.setState(this.getInitialState());
    },
    handleDateChange(date){
        this.setState({
            dueDate: date
        });
    },
    handleUserChange(selection){
        var user = null;
        var user = new Parse.User();
        user.id = selection.value;
        if (selection != null) {
            var name = selection.label.trim().split(" ");
            // user = {className: "_User", objectId: selection.value, firstName: name[0] || "", lastName: name[1] || ""}
            user = Pointer("_User", selection.value, {
                firstName: name[0] || "",
                lastName: name[1] || ""
            });
        }
        this.setState({
            assignedUser: user
        });
    },
    render () {
        var form =
        <div>
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
                maxRows={15}
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
                <Dropdown deal={this.props.deal}
                    handleChange={this.handleUserChange}
                    value={this.props.step.assignedUser != null ? this.props.step.assignedUser.objectId : null}/>
            </FormGroup>

            <NextStepActions step={this.props.step}
                isEdit={true}
                handleSave={this.handleSave}
                afterDelete={this.props.afterDelete}
                handleCancel={this.props.handleCancel}
                />
        </div>
        return form;
    }
})

export default NextStepDetailEdit;
