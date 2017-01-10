import React, { PropTypes } from "react"

const NextStepDeleteButton = React.createClass({
    propTypes: {
        step: PropTypes.object.isRequired,
        afterDelete: PropTypes.func.isRequired
    },
    handleDelete(){
        this.props.afterDelete();
        this.props.step.destroy().catch(error => console.error);
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

export default NextStepDeleteButton
