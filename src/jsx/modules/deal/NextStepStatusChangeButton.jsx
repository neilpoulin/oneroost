import React, { PropTypes } from "react"
import Parse from "parse"
import RoostUtil from "RoostUtil"

const NextStepStatusChangeButton = React.createClass({
    propTypes: {
        step: PropTypes.object.isRequired,
        updateStep: PropTypes.func.isRequired
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
        var step = this.props.step;
        let message = RoostUtil.getFullName(step.modifiedBy) + " marked " + step.title + " as \"Completed\""
        this.props.updateStep({
            "completedDate": new Date(),
            "modifiedBy": Parse.User.current()
        }, message);
    },
    markAsNotDone: function(){
        var step = this.props.step;
        let message = RoostUtil.getFullName(step.modifiedBy) + " marked " + step.title + " as \"Not Complete\""
        this.props.updateStep({
            completedDate: null,
            modifiedBy: Parse.User.current()
        }, message)

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
