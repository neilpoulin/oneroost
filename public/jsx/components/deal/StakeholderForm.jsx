define(['react', 'parse', 'parse-react'], function( React, Parse, ParseReact ){
    return React.createClass({
        mixins: [React.addons.LinkedStateMixin, ParseReact.Mixin],
        observe: function(){
            return {};
        },
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
            console.log("saving stakeholder for deal " + this.state.deal.get("dealName"));
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

                ParseReact.Mutation.Create('Stakeholder', stakeholder, {waitForServer: true}).dispatch();

                var message = self.state.user.get("username") + " added a stakeholder: "
                + createdUser.get("firstName") + " " + createdUser.get("lastName") + " (" + createdUser.get("email") + ")";

                var comment = {
                    deal: self.state.deal,
                    message: message,
                    author: null,
                    username: "OneRoost Bot",
                };
                ParseReact.Mutation.Create('DealComment', comment).dispatch();
            });
        },
        render: function(){
            return (
                <div className="StakeholderFormContainer">
                    <div className="form-group">
                        <label for="firstNameInput">First Name</label>
                        <input id="firstNameInput"
                            type="text"
                            className="form-control"
                            valueLink={this.linkState('firstName')} />
                    </div>
                    <div className="form-group">
                        <label for="lastNameInput">Last Name</label>
                        <input id="lastNameInput"
                            type="text"
                            className="form-control"
                            valueLink={this.linkState('lastName')} />
                    </div>
                    <div className="form-group">
                        <label for="stakeholderEmailInput">Email</label>
                        <input id="stakeholderEmailInput"
                            type="text"
                            className="form-control"
                            valueLink={this.linkState('email')} />
                    </div>
                    <div className="form-group">
                        <label for="userRoleInput">User Role</label>
                        <input id="userRoleInput"
                            type="text"
                            className="form-control"
                            valueLink={this.linkState('role')} />
                    </div>
                </div>
            );
        }
    })
});
