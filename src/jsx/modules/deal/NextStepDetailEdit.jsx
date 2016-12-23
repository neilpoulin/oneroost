import React, { PropTypes } from "react"
import ParseReact from "parse-react"
import Parse from "parse"
import {linkState} from "./../util/LinkState"
import NextStepActions from "./NextStepActions";
import DatePicker from "react-datepicker";
import moment from "moment";
import Dropdown from "./../stakeholder/Dropdown"
import AutosizeTextarea from "react-textarea-autosize";

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
            user: Parse.User.current()
        };
    },
    handleSave: function(){
        var self = this;
        var changes = {
            "title": this.state.title,
            "description": this.state.description,
            "dueDate": this.state.dueDate.toDate(),
            "assignedUser": this.state.assignedUser,
            "deal": this.state.deal,
            "completedDate": this.state.completedDate != null ? new Date(this.state.completedDate) : null,
            "modifiedBy": this.state.user
        };
        ParseReact.Mutation.Set(this.props.step, changes)
        .dispatch()
        .then(function(step) {
            self.addStepSavedComment(step);
        });
        self.clear();
        this.props.afterSave();
    },
    addStepSavedComment: function (step) {
        var self = this;
        var user = Parse.User.current()
        var message = user.get("firstName") + " " + user.get("lastName") + " updated the details of Next Step: " + step.title;
        var comment = {
            deal: self.props.deal,
            message: message,
            author: null,
            username: "OneRoost Bot",
            navLink: {type: "step", id: step.objectId}
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
    handleUserChange(selection){
        var user = null;
        var user = new Parse.User();
        user.id = selection.value;
        if (selection != null) {
            var name = selection.label.trim().split(" ");
            user = {className: "_User", objectId: selection.value, firstName: name[0] || "", lastName: name[1] || ""}
        }
        this.setState({
            assignedUser: user
        });
    },
    render () {
        var form =
        <div>
            <div className="form-group">
                <label htmlFor="nextStepTitle" className="control-label">Title</label>
                <input id="nextStepTitle"
                    type="text"
                    className="form-control"
                    value={this.state.title}
                    onChange={linkState(this, "title")}/>
            </div>
            <div className="form-group">
                <label htmlFor="nextStepDescription" className="control-label">Description</label>
                <AutosizeTextarea
                    className="form-control"
                    maxRows={15}
                    minRows={4}
                    onChange={e => this.setState({description: e.target.value})}
                    value={this.state.description}
                    >
                </AutosizeTextarea>
            </div>
            <div className="form-group">
                <label htmlFor="nextStepDueDate" className="control-label">Due Date</label>

                <DatePicker
                    selected={this.state.dueDate}
                    onChange={this.handleDateChange}
                    className="form-control"
                    id="nextStepDueDate"
                    />
            </div>
            <div className="form-group">
                <label htmlFor="nextStepAssignedUser" className="control-label">Assigned User</label>
                <Dropdown deal={this.props.deal} handleChange={this.handleUserChange} value={this.props.step.assignedUser != null ? this.props.step.assignedUser.objectId : null}/>
            </div>
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
