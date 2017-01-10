import React, { PropTypes } from "react"
import moment from "moment";
import NextStepActions from "NextStepActions"
import Parse from "parse";

const NextStepDetailView = React.createClass({
    propTypes: {
        step: PropTypes.instanceOf(Parse.Object).isRequired,
        handleEdit: PropTypes.func.isRequired
    },
    formatDate(date){
        return moment(date).format("dddd, MMM Do, YYYY");
    },
    render () {
        var asignee = this.props.step.assignedUser;
        var username = "(none)";

        if ( asignee != null )
        {
            username = asignee.firstName + " " + asignee.lastName;
        }
        var dueDate = this.formatDate( this.props.step.dueDate );

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
            <NextStepActions step={this.props.step} isEdit={false} handleEdit={this.props.handleEdit}/>
        </div>

        return form;
    }
})

export default NextStepDetailView
