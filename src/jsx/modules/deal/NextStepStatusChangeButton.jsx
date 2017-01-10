import React, { PropTypes } from "react"
import DealComment from "models/DealComment"
import Parse from "parse"
import RoostUtil from "RoostUtil"

const NextStepStatusChangeButton = React.createClass({
    propTypes: {
        step: PropTypes.instanceOf(Parse.Object).isRequired
    },
    toggleComplete: function(){
        if ( this.props.step.get("completedDate") == null )
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

        step.set({
            "completedDate": new Date(),
            "modifiedBy": Parse.User.current()
        });

        step.save().then(self.addStepStatusChangeComment).catch(error => console.error);
    },
    markAsNotDone: function(){
        var self = this;
        var step = this.props.step;
        step.set({
            completedDate: null,
            modifiedBy: Parse.User.current()
        });

        step.save().then(self.addStepStatusChangeComment).catch(error => console.error);
    },
    addStepStatusChangeComment( step ){
        console.log("step changed...setting up comment");
        var status = step.get("completedDate") != null ? "Complete" : "Not Complete";
        var user = Parse.User.current();

        let comment = new DealComment();
        comment.set({
            deal: step.get("deal"),
            message: RoostUtil.getFullName(user) + " marked " + step.get("title") + " as \"" + status + "\"",
            author: null,
            username: "OneRoost Bot",
            navLink: {type: "step", id: step.id}
        });
        return comment.save();
    },
    render () {
        var completeButton;
        if ( this.props.step.get("completedDate") != null ){
            completeButton =
            <button className="btn btn-primary" onClick={this.toggleComplete}>
                <i className="fa fa-times"/> &nbsp;Not Completed
            </button>;
        }
        else {
            completeButton =
            <button className="btn btn-primary" onClick={this.toggleComplete}>
                <i className="fa fa-check"></i>&nbsp;Completed
            </button>
        }
        return completeButton;
    }
})

export default NextStepStatusChangeButton
