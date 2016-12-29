import React, { PropTypes } from "react"
import FormGroup from "./FormGroup"

const FormInputGroup = React.createClass({
    propTypes: {
        fieldName: PropTypes.string.isRequired,
        label: PropTypes.string,
        errors: PropTypes.object.isRequired,
        onChange: PropTypes.func,
        type: PropTypes.string,
        value: PropTypes.any.isRequired
    },
    getDefaultProps(){
        return {
            label: "",
            type: "text",
            onChange: (val) => {console.log("called default onChange", val)},
        }
    },
    handleChange(e){
        const el = e.target;
        const value = el.type === "checkbox" ? el.checked : el.value;

        let state = {};
        state[this.props.fieldName] = value;
        this.props.onChange(value);
    },
    render () {
        let form =
        <FormGroup
            label={this.props.label}
            errors={this.props.errors}
            fieldName={this.props.fieldName}>
            <input id="nextStepTitle"
                type={this.props.type}
                className="form-control"
                value={this.props.value}
                onChange={this.handleChange}/>
        </FormGroup>
        return form
    }
})

export default FormInputGroup
