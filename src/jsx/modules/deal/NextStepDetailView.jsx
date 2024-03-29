import React from "react"
import PropTypes from "prop-types"
import moment from "moment";
import NextStepActions from "NextStepActions"
import {formatDateLong} from "DateUtil"

const NextStepDetailView = React.createClass({
    propTypes: {
        step: PropTypes.object.isRequired,
        handleEdit: PropTypes.func.isRequired,
        updateStep: PropTypes.func.isRequired,
    },

    render () {
        var asignee = this.props.step.assignedUser;
        var username = "(none)";

        if (asignee != null) {
            username = asignee.firstName + " " + asignee.lastName;
        }
        var dueDate = formatDateLong(this.props.step.dueDate);

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
            <NextStepActions step={this.props.step} isEdit={false} handleEdit={this.props.handleEdit} updateStep={this.props.updateStep}/>
        </div>

        return form;
    }
})

export default NextStepDetailView
