define(['react', 'parse', 'parse-react'], function( React, Parse, ParseReact ){
    return React.createClass({
        mixins: [React.addons.LinkedStateMixin],
        getInitialState: function(){
            return {
                firstName: null,
                lastName: null,
                email: null,
                role: null
            };
        },
        clear: function(){
            this.setState( this.getInitialState() );
        },
        saveStakeholder: function(){
            console.log("saveing stakeholder");
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
