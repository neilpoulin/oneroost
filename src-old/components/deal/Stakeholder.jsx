define([ 'underscore', 'react', 'parse', 'models/Deal', 'parse-react'], function( _, React, Parse, Deal, ParseReact ){
    return React.createClass({
        mixins: [React.addons.LinkedStateMixin],
        deleteStakeholder: function( stakeholder ){
            var stakeholder = this.props.stakeholder;
            ParseReact.Mutation.Destroy( stakeholder ).dispatch();
        },
        render: function(){
            var stakeholder = this.props.stakeholder;
            console.log( stakeholder );
            var user = stakeholder.user;
            var firstName = user.firstName;
            var lastName = user.lastName;
            var email = user.email;
            if ( !user.firstName )
            {
                firstName = user.get("firstName");
                lastName = user.get("lastName");
                email = user.get("email");
            }
            return (
                <li data-name={firstName + " " + lastName} data-email={email} className="hover-effects" >
                    {firstName + " " + lastName} (<a href={'mailto:' + email} target="_blank">{email}</a>)
                    <i className="fa fa-times hover-show delete-icon" onClick={this.deleteStakeholder}></i>
                </li>
            );
        }
    });
});
