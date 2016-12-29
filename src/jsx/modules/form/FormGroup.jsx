import React, { PropTypes } from "react"
import FormUtil from "./../util/FormUtil"

const FormGroup = React.createClass({
    propTypes: {
        fieldName: PropTypes.string.isRequired,
        label: PropTypes.string,
        errors: PropTypes.object.isRequired,
        children: PropTypes.any.isRequired
    },
    getDefaultProps(){
        return {
            label: ""
        }
    },
    render () {
        let form =
        <div className={`form-group ${FormUtil.getErrorClass(this.props.fieldName, this.props.errors)}`}>
            <label className="control-label">{this.props.label}</label>
            {this.props.children}
            {FormUtil.getErrorHelpMessage(this.props.fieldName, this.props.errors)}
        </div>

        return form;
    }
})

export default FormGroup
