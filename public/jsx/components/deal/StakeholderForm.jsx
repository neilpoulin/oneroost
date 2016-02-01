define(['react', 'parse', 'parse-react'], function( React, Parse, ParseReact ){
    return React.createClass({
        mixins: [React.addons.LinkedStateMixin],
        getInitialState: function(){
            return {
                firstName: null,
                lastName: null,
                email: null,
                role: null,
                deal: this.props.deal
            };
        },
        clear: function(){
            this.setState( this.getInitialState() );
        },
        saveStakeholder: function(){
            var self = this;
            console.log("saving stakeholder for deal " + this.state.deal.get("dealName"));
            Parse.Cloud.run('addStakeholder', {
                dealId: self.state.deal.objectId,
                stakeholder: {
                    firstName: this.state.firstName,
                    lastName: this.state.lastName,
                    email: this.state.email,
                    role: this.state.role
                }                
            }).then(function(stakeholder) {
                alert( "added stakeholder" );
                console.log(stakeholder);
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
