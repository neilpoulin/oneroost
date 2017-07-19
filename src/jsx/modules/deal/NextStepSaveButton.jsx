import React from "react"
import PropTypes from "prop-types"

const NextStepSaveButton = React.createClass({
    propTypes: {
        step: PropTypes.object.isRequired,
        handleSave: PropTypes.func.isRequired
    },
    render () {
        var button =
        <button onClick={this.props.handleSave} className="btn btn-success">
            <i className="fa fa-save"></i>&nbsp;Save
        </button>
        return button;
    }
})

export default NextStepSaveButton
