import React, { PropTypes } from "react"
import FormGroup from "FormGroup"
import Select from "react-select"

const FormSelectGroup = React.createClass({
    propTypes: {
        label: PropTypes.string,
        fieldName: PropTypes.string.isRequired,
        value: PropTypes.any.isRequired,
        errors: PropTypes.object.isRequired,
        horizontal: PropTypes.bool,
        options: PropTypes.arrayOf(PropTypes.shape({
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            displayText: PropTypes.string.isRequired,
        })).isRequired,
        name: PropTypes.string,
        autoFocus: PropTypes.bool,
        onChange: PropTypes.func,
        placeholder: PropTypes.string,
    },
    getDefaultProps(){
        return {
            value: "",
            label: "",
            options: [],
        }
    },
    handleChange(value){
        let state = {};
        state[this.props.fieldName] = value;
        if (this.props.onChange){
            this.props.onChange(value);
        }
    },
    render () {
        const {
            label,
            errors,
            fieldName,
            required,
            horizontal,
            children,
            options,
            value,
            placeholder,
        } = this.props

        let $select = <Select
            onChange={this.handleChange}
            value={value}
            placeholder={placeholder}
            options={options.map(({value, displayText, label}) => ({
                value,
                label: label || displayText
            }))}
            />

        let form =
        <FormGroup
            label={label}
            errors={errors}
            fieldName={fieldName}
            required={required}
            horizontal={horizontal}
            >
            {$select}
            {children}
        </FormGroup>
        return form
    }
})

export default FormSelectGroup
