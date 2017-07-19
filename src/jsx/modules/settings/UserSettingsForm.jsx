import React from "react"
import PropTypes from "prop-types"
import {profileValidation} from "ProfileValidations"
import FormUtil from "FormUtil"
import FormInputGroup from "FormInputGroup"
import * as log from "LoggingUtil"
import FormGroupStatic from "FormGroupStatic"

const UserSettingsForm = React.createClass({
    propTypes: {
        user: PropTypes.object.isRequired,
        saveUser: PropTypes.func.isRequired,
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
            log.info("saving user info");
            let {email, firstName, lastName, company, jobTitle} = this.state

            let changes = {
                firstName,
                lastName,
                company,
                jobTitle
            }
            if (this.props.user.email !== email){
                changes.email = email
            }
            this.props.saveUser(changes);
            this.setState({errors: {}});
            return true;
        }
        this.setState({errors: errors});
        return false;
    },
    doCancel(){
        log.info("canceling changes to user info");
        this.setState(this.getInitialState());
        this.props.doCancel();
    },
    render () {
        let {errors, firstName, lastName, jobTitle, email} = this.state;
        let {account, emailVerified} = this.props.user
        var form =
        <div className="">
            <h3>My Profile</h3>
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
                label="Job Title"
                value={jobTitle || ""}
                fieldName="jobTitle"
                onChange={val => this.setState({"jobTitle": val})}
                errors={errors}
                />

            <FormGroupStatic
                value={`${account.accountName}`}
                label="Account"
                />
            <FormGroupStatic
                value={`${emailVerified}`}
                label="Email Verified"
                />
            <div className="actions">
                <button className="btn btn-primary btn-block" onClick={this.doSave}>Save</button>
            </div>
        </div>
        return form
    }
})

export default UserSettingsForm
