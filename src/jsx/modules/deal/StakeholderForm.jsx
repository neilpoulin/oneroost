import React from 'react';
import Parse from 'parse';
import ParseReact from 'parse-react';
import LinkedStateMixin from 'react-addons-linked-state-mixin'

export default React.createClass({
    mixins: [LinkedStateMixin],
    getInitialState: function(){
        return {
            firstName: null,
            lastName: null,
            email: null,
            role: null,
            deal: this.props.deal,
            user: Parse.User.current()
        };
    },
    clear: function(){
        this.setState( this.getInitialState() );
    },
    saveStakeholder: function(){
        var self = this;
        console.log("saving stakeholder for deal " + this.props.deal.dealName);
        var stakeholderRequest = {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            email: this.state.email,
            role: this.state.role
        };
        Parse.Cloud.run('addStakeholder', {
            dealId: self.state.deal.objectId,
            stakeholder: stakeholderRequest
        }).then(function( result ) {
            console.log(result);
            var createdUser = result.user;
            var stakeholder = {
                "user": createdUser,
                "deal": self.state.deal,
                "role": stakeholderRequest.role,
                "inviteAccepted": false,
                "invitedBy": self.state.user
            };
            console.log("attempting to create the stakeholder...");
            console.log(stakeholder);
            ParseReact.Mutation.Create('Stakeholder', stakeholder).dispatch();
            console.log("mutation for stakeholder sent");

            var message = self.state.user.get("username") + " added a stakeholder: "
            + createdUser.get("firstName") + " " + createdUser.get("lastName") + " (" + createdUser.get("email") + ")";

            console.log("created message to send.. " + message )

            var comment = {
                deal: self.props.deal,
                message: message,
                author: null,
                username: "OneRoost Bot",
            };
            console.log("attempting to send comment ");
            ParseReact.Mutation.Create('DealComment', comment).dispatch();

        });
    },
    render: function(){
        return (
            <div className="StakeholderFormContainer">
                <div className="form-group">
                    <label htmlFor="firstNameInput">First Name</label>
                    <input id="firstNameInput"
                        type="text"
                        className="form-control"
                        valueLink={this.linkState('firstName')} />
                </div>
                <div className="form-group">
                    <label htmlFor="lastNameInput">Last Name</label>
                    <input id="lastNameInput"
                        type="text"
                        className="form-control"
                        valueLink={this.linkState('lastName')} />
                </div>
                <div className="form-group">
                    <label htmlFor="stakeholderEmailInput">Email</label>
                    <input id="stakeholderEmailInput"
                        type="text"
                        className="form-control"
                        valueLink={this.linkState('email')} />
                </div>
                <div className="form-group">
                    <label htmlFor="userRoleInput">User Role</label>
                    <input id="userRoleInput"
                        type="text"
                        className="form-control"
                        valueLink={this.linkState('role')} />
                </div>
            </div>
        );
    }
});
