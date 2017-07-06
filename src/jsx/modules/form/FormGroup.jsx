import React from "react"
import FormUtil from "FormUtil"
import PropTypes from "prop-types"

const POSITION_TOP = "top"
const POSITION_BOTTOM = "bottom"
const ALIGN_LEFT = "left"
const ALIGN_RIGHT = "right"

const FormGroup = React.createClass({
    propTypes: {
        fieldName: PropTypes.string.isRequired,
        label: PropTypes.string,
        errors: PropTypes.object.isRequired,
        children: PropTypes.any.isRequired,
        required: PropTypes.bool,
        horizontal: PropTypes.bool,
        labelWidth: PropTypes.number,
        labelAlign: PropTypes.oneOf([ALIGN_LEFT, ALIGN_RIGHT]),
        description: PropTypes.string,
        descriptionPosition: PropTypes.oneOf([POSITION_TOP, POSITION_BOTTOM]),
    },
    getDefaultProps(){
        return {
            label: "",
            required: false,
            horizontal: false,
            labelWidth: 3,
            labelAlign: ALIGN_LEFT,
            descriptionPosition: POSITION_BOTTOM,
        }
    },
    render () {
        let labelClass = ""
        let formClass = ""
        let requiredLabelClass = this.props.required ? " required" : ""
        let children = this.props.children
        const {description, label, errors, fieldName, descriptionPosition} = this.props

        if (this.props.horizontal){
            labelClass = `col-sm-${this.props.labelWidth}`
            formClass = "form-inline";
            let valueClass = 12 - this.props.labelWidth;
            children = <div className={`col-sm-${valueClass}`}>{children}</div>
        }

        let form =
        <div className={`form-group ${FormUtil.getErrorClass(this.props.fieldName, this.props.errors)} ${formClass}`}>
            <label display-if={label}
                className={`control-label ${requiredLabelClass} ${labelClass} label-${this.props.labelAlign}`}>
                    {label}
                </label>
                <p className="help-block" display-if={description && descriptionPosition === POSITION_TOP}>{description}</p>
            {children}
            <p className="help-block" display-if={description && descriptionPosition === POSITION_BOTTOM}>{description}</p>
            {FormUtil.getErrorHelpMessage(fieldName, errors)}
        </div>

        return form;
    }
})

export default FormGroup
