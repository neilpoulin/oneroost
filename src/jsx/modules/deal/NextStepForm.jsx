import React, { PropTypes } from "react"

const NextStepForm = React.createClass({
    propTypes: function(){
        step: PropTypes.object.isRequired
    },
    render () {
        var form =
        <div>Hello! StepTitle = {this.props.step.title} </div>
        return form;
    }
})

export default NextStepForm
