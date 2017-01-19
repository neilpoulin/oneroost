import React, { PropTypes } from "react"
import DealComment from "models/DealComment"
import Parse from "parse"
import RoostUtil from "RoostUtil"

const NextStepStatusChangeButton = React.createClass({
    propTypes: {
        step: PropTypes.instanceOf(Parse.Object).isRequired
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
        // var self = this;
        // var step = this.props.step;
        console.error("This needs to be updated to use actions, and will not work now.")
        // step.set({
        //     "completedDate": new Date(),
        //     "modifiedBy": Parse.User.current()
        // });
        //
        // step.save().then(self.addStepStatusChangeComment).catch(error => console.error);
    },
    markAsNotDone: function(){
        var self = this;
        var {step} = this.props;
        step.set({
            completedDate: null,
            modifiedBy: Parse.User.current()
        });

        step.save().then(self.addStepStatusChangeComment).catch(error => console.error);
    },
    addStepStatusChangeComment( step ){
        console.log("step changed...setting up comment");
        const {title, deal, completedDate} = step.toJSON();
        var user = Parse.User.current();
        var status = completedDate != null ? "Complete" : "Not Complete";
        let comment = new DealComment();
        comment.set({
            deal: deal,
            message: RoostUtil.getFullName(user) + " marked " + title + " as \"" + status + "\"",
            author: null,
            username: "OneRoost Bot",
            navLink: {type: "step", id: step.objectId}
        });
        return comment.save();
    },
    render () {
        const {completedDate} = this.props.step;
        var completeButton;
        if ( completedDate != null ){
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
