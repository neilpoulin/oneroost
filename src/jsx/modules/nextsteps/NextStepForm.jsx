import React from "react";
import Parse from "parse";
import ParseReact from "parse-react";
import LinkedStateMixin from "react-addons-linked-state-mixin"
var DatePicker = require("react-datepicker");
var moment = require("moment");
import Dropdown from "./../stakeholder/Dropdown"
import AutosizeTextarea from "react-textarea-autosize";

export default React.createClass({
    mixins: [LinkedStateMixin],
    getInitialState: function () {
        return {
            title: null,
            description: null,
            dueDate: moment(),
            createdBy: Parse.User.current(),
            assignedUser: null,
            deal: this.props.deal,
            completedDate: null,
            user: Parse.User.current()
        };
    },
    doSubmit: function () {
        this.saveNextStep();
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
            "completedDate": this.state.completedDate != null ? new Date(this.state.completedDate) : null
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
            <div className="form-group">
                <label htmlFor="nextStepTitle">Title</label>
                <input id="nextStepTitle"
                    type="text"
                    className="form-control"
                    valueLink={this.linkState("title")}/>
            </div>
            <div className="form-group">
                <label htmlFor="nextStepDescription">Description</label>
                    <AutosizeTextarea
                        className="form-control"
                        maxRows={10}
                        minRows={4}
                        onChange={e => this.setState({description: e.target.value})}
                        value={this.state.description}
                        >
                    </AutosizeTextarea>
            </div>
            <div className="form-group">
                <label htmlFor="nextStepDueDate">Due Date</label>

                <DatePicker
                    selected={this.state.dueDate}
                    onChange={this.handleDateChange}
                    className="form-control"
                    id="nextStepDueDate"
                    />

            </div>
            <div className="form-group">
                <label htmlFor="nextStepAssignedUser">Assigned User</label>

                <Dropdown deal={this.props.deal} handleChange={this.handleUserChange}/>

            </div>
        </div>
        return form;
    }
});
