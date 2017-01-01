import React, { PropTypes } from "react"
import FormGroup from "FormGroup"
import AutosizeTextarea from "react-textarea-autosize";

const AutosizeTextAreaFormGroup = React.createClass({
    propTypes: {
        fieldName: PropTypes.string.isRequired,
        label: PropTypes.string,
        errors: PropTypes.object.isRequired,
        onChange: PropTypes.func,
        type: PropTypes.string,
        value: PropTypes.any.isRequired,
        minRows: PropTypes.number,
        maxRows: PropTypes.number,
        horizontal: PropTypes.bool,
    },
    getDefaultProps(){
        return {
            label: "",
            type: "text",
            minRows: 2,
            maxRows: 6,
            onChange: (val) => {console.log("called default onChange", val)},
            horizontal: false,
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
            fieldName={this.props.fieldName}
            horizontal={this.props.horizontal}>
            <AutosizeTextarea
                className="form-control"
                maxRows={this.props.maxRows}
                minRows={this.props.minRows}
                onChange={this.handleChange}
                value={this.props.value}
                >
            </AutosizeTextarea>
        </FormGroup>
        return form;
    }
})

export default AutosizeTextAreaFormGroup
