import React, { PropTypes } from "react"
import FormGroup from "FormGroup"

const FormInputGroup = React.createClass({
    propTypes: {
        fieldName: PropTypes.string.isRequired,
        label: PropTypes.string,
        errors: PropTypes.object.isRequired,
        onChange: PropTypes.func,
        type: PropTypes.string,
        value: PropTypes.any.isRequired,
        placeholder: PropTypes.string,
        required: PropTypes.bool,
        addonBefore: PropTypes.string,
        addonAfter: PropTypes.string,
    },
    getDefaultProps(){
        return {
            label: "",
            type: "text",
            placeholder: "",
            required: false,
            addonBefore: null,
            addonAfter: null,
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
    getAddonBefore(){
        if ( this.props.addonBefore ){
            return <span className="input-group-addon">{this.props.addonBefore}</span>
        }
        return null;
    },
    getAddonAfter(){
        if ( this.props.addonAfter ){
            return <span className="input-group-addon">{this.props.addonAfter}</span>
        }
        return null;
    },
    render () {
        let input = <input id="nextStepTitle"
            type={this.props.type}
            className="form-control"
            value={this.props.value}
            placeholder={this.props.placeholder}
            onChange={this.handleChange}/>

        if ( this.props.addonBefore || this.props.addonAfter ){
            input =
            <div className="input-group">
                {this.getAddonBefore()}
                {input}
                {this.getAddonAfter()}
            </div>
        }

        let form =
        <FormGroup
            label={this.props.label}
            errors={this.props.errors}
            fieldName={this.props.fieldName}
            required={this.props.required}
            >
            {input}
            {this.props.children}
        </FormGroup>
        return form
    }
})

export default FormInputGroup
