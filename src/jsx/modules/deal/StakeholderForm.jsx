import React, {PropTypes} from "react"
import Parse from "parse"
import ParseReact from "parse-react"
import StakeholderValidation from "StakeholderValidation"
import FormUtil from "FormUtil"
import FormInputGroup from "FormInputGroup"

export default React.createClass({
    propTypes: {
        deal: PropTypes.shape({
            objectId: PropTypes.string.isRequired
        })
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
            user: Parse.User.current()
        };
    },
    clear: function(){
        this.setState( this.getInitialState() );
    },
    doSubmit(){
        var errors = FormUtil.getErrors(this.state, StakeholderValidation);
        if ( !FormUtil.hasErrors(errors) ){
            this.saveStakeholder();
            this.setState({errors: {}});
            return true;
        }
        this.setState({errors: errors});
        return false;
    },
    saveStakeholder: function(){
        var self = this;
        var stakeholderRequest = {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            company: this.state.company,
            email: this.state.email,
            role: this.state.role
        };
        Parse.Cloud.run("addStakeholder", {
            dealId: self.state.deal.objectId,
            stakeholder: stakeholderRequest
        }).then(function( result ) {
            if ( result.exists ){
                alert("this user is already a stakeholder on this opportunity.");
                return;
            }
            var createdUser = result.user;
            createdUser.firstName = createdUser.get("firstName");
            createdUser.lastName = createdUser.get("lastName");
            createdUser.email = createdUser.get("email");
            createdUser.company = createdUser.get("company");
            var stakeholder = {
                "user": createdUser,
                "deal": self.state.deal,
                "role": stakeholderRequest.role,
                "inviteAccepted": false,
                "invitedBy": self.state.user
            };

            ParseReact.Mutation.Create("Stakeholder", stakeholder).dispatch();

            var message = self.state.user.get("firstName") + " " + self.state.user.get("lastName") + " added a stakeholder: "
            + createdUser.get("firstName") + " " + createdUser.get("lastName") + " (" + createdUser.get("email") + ")";

            var comment = {
                deal: self.props.deal,
                message: message,
                author: null,
                username: "OneRoost Bot",
                navLink: {type:"participant"}
            };
            ParseReact.Mutation.Create("DealComment", comment).dispatch();

        }, function(error){
            alert("this user is already a stakeholder on this opportunity.");
            console.error(error);
        });

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
