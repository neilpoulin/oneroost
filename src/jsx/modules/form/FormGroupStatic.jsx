import React, { PropTypes } from "react"
import FormGroup from "FormGroup"

const FormGroupStatic = React.createClass({
    propTypes: {
        label: PropTypes.string,
        value: PropTypes.any.isRequired,
        horizontal: PropTypes.bool,
        labelAlign: PropTypes.oneOf(["left", "right"]),
    },
    getDefaultProps(){
        return {
            label: "",
            horizontal: false,
            value: "",
            labelAlign: "left",
            errors: {}
        }
    },
    render () {
        const {value, label, horizontal, errors, labelAlign} = this.props;

        let form =
        <FormGroup
            label={label}
            horizontal={horizontal}
            labelWidth={3}
            fieldName={`${label}`}
            labelAlign={labelAlign}
            errors={errors}>
            <p className="form-control-static">{value}</p>
            {this.props.children}
        </FormGroup>
        return form
    }
})

export default FormGroupStatic
