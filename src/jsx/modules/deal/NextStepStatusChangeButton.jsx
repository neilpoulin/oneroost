import React, { PropTypes } from "react"
import ParseReact from "parse-react"
import Parse from "parse"

const NextStepStatusChangeButton = React.createClass({
    propTypes: {
        step: PropTypes.object.isRequired
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
        ParseReact.Mutation.Set( step, {
            "completedDate": new Date(),
            "modifiedBy": Parse.User.current()
        })
        .dispatch()
        .then(function( step ){
            self.addStepStatusChangeComment( step );
            self.setState({step: step});
        });
    },
    markAsNotDone: function(){
        var self = this;
        var step = this.props.step;
        ParseReact.Mutation.Set( step, {
            "completedDate": null,
            "modifiedBy": Parse.User.current()
        })
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
        var message = user.get("firstName") + " "+ user.get("lastName") + " marked " + step.title + " as \"" + status + "\"";

        var comment = {
            deal: self.props.step.deal,
            message: message,
            author: null,
            username: "OneRoost Bot",
            navLink: {type: "step", id: step.objectId}
        };
        ParseReact.Mutation.Create("DealComment", comment).dispatch();
    },
    render () {
        var completeButton;
        if ( this.props.step.completedDate != null ){
            completeButton =
            <button className="btn btn-outline-warning" onClick={this.toggleComplete}>
                <i className="fa fa-times"/> &nbsp;Not Completed
            </button>;
        }
        else {
            completeButton =
            <button className="btn btn-outline-success" onClick={this.toggleComplete}>
                <i className="fa fa-check"></i>&nbsp;Completed
            </button>
        }
        return completeButton;
    }
})

export default NextStepStatusChangeButton
