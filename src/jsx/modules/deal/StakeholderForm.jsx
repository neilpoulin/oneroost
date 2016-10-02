import React, {PropTypes} from "react";
import Parse from "parse";
import ParseReact from "parse-react";
import LinkedStateMixin from "react-addons-linked-state-mixin"

export default React.createClass({
    mixins: [LinkedStateMixin],
    propTypes: {
        deal: PropTypes.shape({
            objectId: PropTypes.string.isRequired
        })
    },
    getInitialState: function(){
        return {
            firstName: null,
            lastName: null,
            email: null,
            role: "VENDOR",
            deal: this.props.deal,
            user: Parse.User.current()
        };
    },
    clear: function(){
        this.setState( this.getInitialState() );
    },
    doSubmit(){
        this.saveStakeholder();
    },
    saveStakeholder: function(){
        var self = this;
        var stakeholderRequest = {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            email: this.state.email,
            role: this.state.role
        };
        Parse.Cloud.run("addStakeholder", {
            dealId: self.state.deal.objectId,
            stakeholder: stakeholderRequest
        }).then(function( result ) {
            var createdUser = result.user;
            createdUser.firstName = createdUser.get("firstName");
            createdUser.lastName = createdUser.get("lastName");
            createdUser.email = createdUser.get("email");
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

        });
    },
    render: function(){
        var form =
        <div className="StakeholderFormContainer">
            <div className="form-group">
                <label htmlFor="firstNameInput">First Name</label>
                <input id="firstNameInput"
                    type="text"
                    className="form-control"
                    valueLink={this.linkState("firstName")} />
            </div>
            <div className="form-group">
                <label htmlFor="lastNameInput">Last Name</label>
                <input id="lastNameInput"
                    type="text"
                    className="form-control"
                    valueLink={this.linkState("lastName")} />
            </div>
            <div className="form-group">
                <label htmlFor="stakeholderEmailInput">Email</label>
                <input id="stakeholderEmailInput"
                    type="text"
                    className="form-control"
                    valueLink={this.linkState("email")} />
            </div>
            <div className="form-group">
                <label htmlFor="userRoleInput">User Role</label>
                <select id="userRoleInput"
                    type="text"
                    className="form-control"
                    valueLink={this.linkState("role")}
                    defaultValue={this.state.role} >
                    <option value="CLIENT" defaultValue>Client</option>
                    <option value="VENDOR">Vendor</option>
                </select>
            </div>
        </div>
        return form;
    }
});
