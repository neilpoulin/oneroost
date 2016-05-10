import React, { PropTypes } from "react"

const NextStepEditButton = React.createClass({
    propTypes: {
        handleEdit: PropTypes.func.isRequired
    },
    render () {
        var button =
        <button className="btn btn-outline-primary" onClick={this.props.handleEdit}><i className="fa fa-pencil"></i> Edit</button>;
        return button;
    }
})

export default NextStepEditButton
