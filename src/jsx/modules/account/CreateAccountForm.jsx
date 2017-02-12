import React, {PropTypes} from "react";
import FormUtil from "FormUtil"
import {validations} from "account/AccountValidation"
import FormInputGroup from "FormInputGroup"
import * as log from "LoggingUtil"

const CreateAccountForm = React.createClass({
    propTypes: {
        createRoost: PropTypes.func.isRequired,
    },
    getDefaultProps: function(){
        return{
            onSuccess: function(){}
        }
    },
    getInitialState: function(){
        return {
            accountName: "",
            dealName: "",
            primaryContact: "",
            streetAddress: "",
            city: "",
            state: "",
            zipCode: "",
            errors: {}
        };
    },
    doSubmit: function()
    {
        var self = this;
        var errors = FormUtil.getErrors(this.state, validations);
        log.info(errors);
        if ( Object.keys(errors).length === 0 && errors.constructor === Object ){
            // this.saveDeal();
            let {accountName,
                primaryContact,
                streetAddress,
                city,
                state,
                zipCode,
                dealName} = this.state;
            this.props.createRoost({
                accountName,
                primaryContact,
                streetAddress,
                city,
                state,
                zipCode,
                dealName
            })

            this.setState({errors: {}});
            return true;
        }
        self.setState({errors: errors});
        return false;
    },
    render: function(){
        return (
            <div className="CreateAccount">
                <FormInputGroup
                    fieldName="accountName"
                    label="Company Name"
                    errors={this.state.errors}
                    onChange={val => this.setState({"accountName": val})}
                    value={this.state.accountName}
                    />

                <FormInputGroup
                    fieldName="dealName"
                    label="Problem Summary"
                    errors={this.state.errors}
                    onChange={val => this.setState({"dealName": val})}
                    value={this.state.dealName}
                    >
                    <span className="help-block">briefly explain your offering in 40 characters or less</span>
                </FormInputGroup>
            </div>
        );
    }
});

export default CreateAccountForm;
