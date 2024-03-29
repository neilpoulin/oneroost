import React from "react"
import PropTypes from "prop-types"
import Parse from "parse"
import * as RoostUtil from "RoostUtil"

const NextStepStatusChangeButton = React.createClass({
    propTypes: {
        step: PropTypes.object.isRequired,
        updateStep: PropTypes.func.isRequired
    },
    toggleComplete: function(){
        if (this.props.step.completedDate == null) {
            this.markAsDone();
        }
        else {
            this.markAsNotDone();
        }
    },
    markAsDone: function(){
        var step = this.props.step;
        let user = Parse.User.current()
        let message = RoostUtil.getFullName(user) + " marked " + step.title + " as \"Completed\""
        this.props.updateStep({
            completedDate: new Date(),
            modifiedBy: user,
        }, message);
    },
    markAsNotDone: function(){
        var step = this.props.step;
        let user = Parse.User.current()
        let message = RoostUtil.getFullName(user) + " marked " + step.title + " as \"Not Complete\""
        this.props.updateStep({
            completedDate: null,
            modifiedBy: user,
        }, message)
    },
    render () {
        const {completedDate} = this.props.step;
        var completeButton;
        if (completedDate != null){
            completeButton =
            <button className="btn btn-primary" onClick={this.toggleComplete}>
                <i className="fa fa-times"/> &nbsp;Mak as Not Complete
            </button>;
        }
        else {
            completeButton =
            <button className="btn btn-primary" onClick={this.toggleComplete}>
                <i className="fa fa-check"></i>&nbsp;Mark as Completed
            </button>
        }
        return completeButton;
    }
})

export default NextStepStatusChangeButton
