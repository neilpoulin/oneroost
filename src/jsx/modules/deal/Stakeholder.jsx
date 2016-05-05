import _ from 'underscore';
import React from 'react';
import Parse from 'parse';
import ParseReact from 'parse-react';
import LinkedStateMixin from 'react-addons-linked-state-mixin'

export default React.createClass({
  mixins: [LinkedStateMixin],
  deleteStakeholder: function (stakeholder) {
    var stakeholder = this.props.stakeholder;
    ParseReact.Mutation.Destroy(stakeholder).dispatch();
  },
  render: function () {
    var stakeholder = this.props.stakeholder;
    var user = stakeholder.user;
    var firstName = user.firstName;
    var lastName = user.lastName;
    var email = user.email;
    if (!user.firstName) {
      firstName = user.get("firstName");
      lastName = user.get("lastName");
      email = user.get("email");
    }

    var roleClass = stakeholder.role.toLowerCase();

    return (
      <div data-name={firstName + " " + lastName} data-email={email} className="Stakeholder row">
        <div className="col-xs-10 container-fluid">
          <span className={"roleName label " + roleClass}>{stakeholder.role}</span>
          <a href={"mailto:" + email} target="_blank">
            {firstName}&nbsp;{lastName}
          </a>
        </div>
        <div className="col-xs-2 container-fluid">
          <i className="fa fa-times delete-icon pointer visible-hover text-center" onClick={this.deleteStakeholder}></i>
        </div>
      </div>
    );
  }
});
