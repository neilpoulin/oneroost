import React from "react";
import Parse from "parse";
import ParseReact from "parse-react";
import LinkedStateMixin from "react-addons-linked-state-mixin"

export default React.createClass({
    mixins: [LinkedStateMixin],
    deleteStakeholder: function (stakeholder) {
        var self = this;
        var stakeholder = this.props.stakeholder;
        ParseReact.Mutation.Destroy(stakeholder)
        .dispatch()
        .then(function(){
            self.sendComment(stakeholder)
        });
    },
    sendComment(stakeholder)
    {
        var user = Parse.User.current();
        var message = user.get("firstName") + " " + user.get("lastName") + " removed a stakeholder: "
        + stakeholder.user.firstName + " " + stakeholder.user.lastName + " (" + stakeholder.user.email + ")";

        var comment = {
            deal: stakeholder.deal,
            message: message,
            author: null,
            username: "OneRoost Bot",
            navLink: {type:"participant"}
        };
        ParseReact.Mutation.Create("DealComment", comment).dispatch();
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
        var pendingText = null;
        if ( !stakeholder.inviteAccepted )
        {
            pendingText = <span className="penidng">(Invite Pending)</span>
        }


        var result =
        <div data-name={firstName + " " + lastName} data-email={email} className="Stakeholder row">
            <div className="col-xs-10 container-fluid">
                <span className={"roleName label " + roleClass}>{stakeholder.role}</span>
                <a href={"#"}>
                    {firstName}&nbsp;{lastName} {pendingText}
                </a>
            </div>
            <div className="col-xs-2 container-fluid">
                <i className="fa fa-times delete-icon pointer visible-hover text-center" onClick={this.deleteStakeholder}></i>
            </div>
        </div>

        return result;
    }
});
