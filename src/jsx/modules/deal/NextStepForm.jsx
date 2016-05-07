import React, { PropTypes } from "react"
import moment from "moment";
import Parse from "parse";
import ParseReact from "parse-react";

const NextStepForm = React.createClass({
    propTypes: function(){
        step: PropTypes.object.isRequired
    },
    formatDate(date){
        return moment(date).format("dddd, MMM Do, YYYY");
    },
    toggleComplete: function(){
        if ( this.props.step.completedDate == null )
        {
            this.markAsDone();
        }
        else {
            this.markAsNotDone();
        }
    },
    markAsDone: function(){
        var self = this;
        var step = this.props.step;
        ParseReact.Mutation.Set( step, {"completedDate": new Date()} )
        .dispatch()
        .then(function( step ){
            self.addStepStatusChangeComment( step );
            self.setState({step: step});
        });
    },
    markAsNotDone: function(){
        var self = this;
        var step = this.props.step;
        ParseReact.Mutation.Set( step, {"completedDate": null} )
        .dispatch()
        .then(function( step ){
            self.addStepStatusChangeComment( step );
            self.setState({step: step});
        });
    },
    addStepStatusChangeComment: function( step ){
        var self = this;
        var status = self.props.step.completedDate != null ? "Complete" : "Not Complete";
        var user = Parse.User.current();
        var message = user.get("username") + " marked " + step.title + " as \"" + status + "\".";

        var comment = {
            deal: self.props.step.deal,
            message: message,
            author: null,
            username: "OneRoost Bot",
        };
        ParseReact.Mutation.Create("DealComment", comment).dispatch();
    },
    render () {
        var asignee = this.props.step.assignedUser;
        var username = "(none)";

        if ( asignee != null )
        {
            username = asignee.firstName + " " + asignee.lastName;
        }
        var dueDate = this.formatDate( this.props.step.dueDate );
        var completeButton = <button className="btn btn-outline-success" onClick={this.toggleComplete}><i className="fa fa-check"></i> Completed</button>;
        if ( this.props.step.completedDate != null )
        {
            completeButton = <button className="btn btn-outline-warning" onClick={this.toggleComplete}><i className="fa fa-times"></i> Not Completed</button>;
        }
        var form =
        <div className="NextStepSidebarForm">
            <div>
                <div className="fieldLabel">
                    Assigned to
                </div>
                <div className="field">
                    {username}
                </div>
            </div>
            <div>
                <div className="fieldLabel">
                    Due Date
                </div>
                <div className="field">
                    {dueDate}
                </div>
            </div>
            <div>
                <div className="fieldLabel">
                    Description
                </div>
                <div className="field">
                    {this.props.step.description || "none"}
                </div>
            </div>
            <div className="actionsBar">
                <button className="btn btn-outline-primary"><i className="fa fa-pencil"></i> Edit</button>
                {completeButton}
            </div>
        </div>

        return form;
    }
})

export default NextStepForm
