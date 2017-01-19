import React, { PropTypes } from "react"
import {profileValidation} from "profile/ProfileValidations"
import FormUtil from "FormUtil"
import FormInputGroup from "FormInputGroup"

const BasicInfoForm = React.createClass({
    propTypes: {
        user: PropTypes.object.isRequired,
        doCancel: PropTypes.func.isRequired,
        doSave: PropTypes.func.isRequired,
    },
    getDefaultProps(){
        return {
            onCancel: function(){
                console.error("failed to impelement onCancel for BasicInfoForm");
            },
            onSave: function(){
                console.error("Failed to implement onSave for BasicInfoForm");
            }
        }
    },
    getInitialState(){
        var user = this.props.user;
        return {
            ...user,
            errors: {},
        }
    },
    doSave(){
        let errors = FormUtil.getErrors(this.state, profileValidation);
        if (!FormUtil.hasErrors(errors)){
            console.log("saving user info");
            console.error("NEED TO USE ACTIONS FOR THIS TO WORK")
            let {user} = this.props;
            user.set("email", this.state.email)
            user.set("firstName", this.state.firstName)
            user.set("lastName", this.state.lastName)
            user.set("company", this.state.company)
            user.set("jobTitle", this.state.jobTitle)
            user.save()
            this.props.doSave()
            this.setState({errors: {}});
            return true;
        }
        this.setState({errors: errors});
        return false;
    },
    doCancel(){
        console.log("canceling changes to user info");
        this.setState(this.getInitialState());
        this.props.doCancel();
    },
    render () {
        let {errors, firstName, lastName, company, jobTitle, email} = this.state;
        var form =
        <div className="">
            <h2>Edit your info</h2>
            <div className="form-inline-equal">
                <FormInputGroup
                    label="First Name"
                    fieldName="firstName"
                    value={firstName}
                    onChange={val => this.setState({"firstName": val})}
                    errors={errors}
                    />
                <FormInputGroup
                    label="Last Name"
                    fieldName="lastName"
                    value={lastName}
                    onChange={val => this.setState({"lastName": val})}
                    errors={errors}
                    />
            </div>

            <FormInputGroup
                label="Email"
                fieldName="email"
                value={email}
                onChange={val => this.setState({"email": val})}
                errors={errors}
                />

            <FormInputGroup
                label="Company"
                value={company}
                fieldName="company"
                onChange={val => this.setState({"company": val})}
                errors={errors}
                />

            <FormInputGroup
                label="Job Title"
                value={jobTitle}
                fieldName="jobTitle"
                onChange={val => this.setState({"jobTitle": val})}
                errors={errors}
                />

            <div className="actions">
                <button className="btn btn-link pull-left" onClick={this.doCancel}>Cancel</button>
                <button className="btn btn-primary pull-right" onClick={this.doSave}>Save</button>
            </div>
        </div>
        return form
    }
})

export default BasicInfoForm
