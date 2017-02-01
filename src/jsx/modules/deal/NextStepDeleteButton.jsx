import React, { PropTypes } from "react"
import {connect} from "react-redux"
import {deleteStep} from "ducks/nextSteps"
import * as RoostUtil from "RoostUtil"

const NextStepDeleteButton = React.createClass({
    propTypes: {
        step: PropTypes.object.isRequired,
        afterDelete: PropTypes.func.isRequired,
        user: PropTypes.object.isRequired,
    },
    handleDelete(){
        var message = RoostUtil.getFullName(this.props.user) + " deleted Next Step: " + this.props.step.title
        this.props.deleteStep(message)
        this.props.afterDelete();
        // this.props.step.destroy().catch(error => console.error);
    },
    render () {
        var button =
        <button className="btn btn-outline-danger" onClick={this.handleDelete}>
            <i className="fa fa-trash">
            </i>
            Delete
        </button>;
        return button;
    }
})

const mapStateToProps = (state, ownProps) => {
    return {
        user: RoostUtil.getCurrentUser(state)
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    const step = ownProps.step;
    return {
        deleteStep: (message) => {
            dispatch(deleteStep(step, message))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NextStepDeleteButton)
