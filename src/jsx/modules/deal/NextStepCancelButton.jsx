import React, { PropTypes } from "react"

const NextStepCancelButton = React.createClass({
    propTypes: {
        handleCancel: PropTypes.func.isRequired
    },
    getDefaultProps: function(){
        return {
            text: "Cancel",
            className: "btn-link"
        }
    },
    render () {
        var button =
        <button className={"btn " + this.props.className} onClick={this.props.handleCancel}>
            {this.props.text}
        </button>
        return button;
    }
})

export default NextStepCancelButton
