import React, { PropTypes } from "react"
import FormGroup from "FormGroup"

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
    },
    getDefaultProps(){
        return {
            value: "",
            label: "",
            options: [],
        }
    },
    handleChange(e){
        const el = e.target;
        const value = el.value;

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
        } = this.props

        let $select = <select onChange={this.handleChange} value={value}>
            {options.map((opt, i) =>
                <option key={`${opt.value}_${i}`} value={opt.value}>{opt.displayText}</option>
            )}
        </select>

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
