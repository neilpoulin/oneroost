import React, {PropTypes} from "react"
import StakeholderValidation from "StakeholderValidation"
import FormUtil from "FormUtil"
import FormInputGroup from "FormInputGroup"

export default React.createClass({
    propTypes: {
        deal: PropTypes.object.isRequired,
        inviteUser: PropTypes.func.isRequired
    },
    getInitialState: function(){
        return {
            firstName: "",
            lastName: "",
            email: "",
            role: "VENDOR",
            company: "",
            deal: this.props.deal,
            errors: {},
        };
    },
    clear: function(){
        this.setState(this.getInitialState());
    },
    doSubmit(){
        var errors = FormUtil.getErrors(this.state, StakeholderValidation);
        if (!FormUtil.hasErrors(errors)){
            this.saveStakeholder();
            this.setState({errors: {}});
            return true;
        }
        this.setState({errors: errors});
        return false;
    },
    saveStakeholder: function(){
        let userInfo = {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            company: this.state.company,
            email: this.state.email,
            role: this.state.role
        };
        this.props.inviteUser(userInfo)
    },
    render: function(){
        let {errors, firstName, lastName, email, company} = this.state
        var form =
        <div className="StakeholderFormContainer">
            <div className="form-inline-half">
                <FormInputGroup
                    fieldName="firstName"
                    value={firstName}
                    onChange={val => this.setState({firstName: val})}
                    label="First Name"
                    errors={errors}
                    placeholder=""
                    required={true} />

                <FormInputGroup
                    fieldName="lastName"
                    value={lastName}
                    onChange={val => this.setState({lastName: val})}
                    label="Last Name"
                    errors={errors}
                    placeholder=""
                    required={true} />
            </div>
            <FormInputGroup
                fieldName="email"
                value={email}
                onChange={val => this.setState({email: val})}
                label="Email"
                errors={errors}
                placeholder=""
                required={true} />

            <FormInputGroup
                fieldName="company"
                value={company}
                onChange={val => this.setState({company: val})}
                label="Company"
                errors={errors}
                placeholder=""
                required={true} />
        </div>
        return form;
    }
});
