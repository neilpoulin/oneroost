import React, { PropTypes } from "react"
import ParseReact from "parse-react"

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
