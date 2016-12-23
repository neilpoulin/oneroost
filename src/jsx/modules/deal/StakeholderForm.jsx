import React, {PropTypes} from "react"
import Parse from "parse"
import ParseReact from "parse-react"
import {linkState} from "./../util/LinkState"
import FormUtil, {Validation} from "./../util/FormUtil"

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
    validations: {
        email: new Validation(FormUtil.isValidEmail, "error", "A valid email is required"),
        firstName: new Validation(FormUtil.notNullOrEmpty, "error", "A first name is required"),
        lastName: new Validation(FormUtil.notNullOrEmpty, "error", "A last name is required"),
        company: new Validation(FormUtil.notNullOrEmpty, "error", "A company name is required")
    },
    clear: function(){
        this.setState( this.getInitialState() );
    },
    doSubmit(){
        var errors = this.getValidations();
        console.log(errors);
        if ( Object.keys(errors).length === 0 && errors.constructor === Object ){
            this.saveStakeholder();
            return true;
        }
        this.setState({errors: errors});
        return false;
    },
    getValidations()
    {
        return FormUtil.getErrors(this.state, this.validations);
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
    getErrorClass(field){
        var errors = this.state.errors;
        if (errors[field] )
        {
            return "has-" + errors[field].level
        }
        else return null;
    },
    getErrorHelpMessage(field){
        var errors = this.state.errors;
        if ( errors[field] )
        {
            var error = errors[field];
            return <span key={"stakeholder_error_" + field} className="help-block">{error.message}</span>
        }
        return null
    },
    render: function(){
        var form =
        <div className="StakeholderFormContainer">
            <div className="form-inline-half">
                <div className={"form-group " + this.getErrorClass("firstName")}>
                    <label htmlFor="firstNameInput" className="control-label">First Name</label>
                    <input id="firstNameInput"
                        type="text"
                        className="form-control"
                        value={this.state.firstName}
                        onChange={linkState(this, "firstName")} />
                    {this.getErrorHelpMessage("firstName")}

                </div>
                <div className={"form-group " + this.getErrorClass("lastName")}>
                    <label htmlFor="lastNameInput" className="control-label">Last Name</label>
                    <input id="lastNameInput"
                        type="text"
                        className="form-control"
                        value={this.state.lastName}
                        onChange={linkState(this,"lastName")} />
                    {this.getErrorHelpMessage("lastName")}
                </div>
            </div>
            <div className={"form-group " + this.getErrorClass("email")}>
                <label htmlFor="stakeholderEmailInput" className="control-label">Email</label>
                <input id="stakeholderEmailInput"
                    type="text"
                    className="form-control"
                    value={this.state.email}
                    onChange={linkState(this,"email")} />
                {this.getErrorHelpMessage("email")}
            </div>
            <div className={"form-group " + this.getErrorClass("company")}>
                <label htmlFor="stakeholderCompanyInput" className="control-label">Company</label>
                <input id="stakeholderCompanyInput"
                    type="text"
                    className="form-control"
                    value={this.state.company}
                    onChange={linkState(this,"company")} />
                {this.getErrorHelpMessage("company")}
            </div>
        </div>
        return form;
    }
});
