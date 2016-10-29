import React from "react";
import Parse from "parse";
import ParseReact from "parse-react";
import LinkedStateMixin from "react-addons-linked-state-mixin"
import RoostUtil from "./../util/RoostUtil"

export default React.createClass({
    mixins: [LinkedStateMixin],
    deleteStakeholder: function (stakeholder) {
        var self = this;
        var stakeholder = this.props.stakeholder;
        var confirm = window.confirm("Are you sure you want to remove this user?" );

        if ( confirm ){
            ParseReact.Mutation.Destroy(stakeholder)
            .dispatch()
            .then(function(){
                self.sendComment(stakeholder)
            });
        }

    },
    sendComment(stakeholder)
    {
        var user = Parse.User.current();
        var fullName = RoostUtil.getFullName(user)
        var message = fullName + " removed a stakeholder: "
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
        var fullName = RoostUtil.getFullName( user )
        var email = user.email || user.get("email")

        var roleClass = stakeholder.role.toLowerCase();
        var pendingText = null;
        if ( !stakeholder.inviteAccepted )
        {
            pendingText = <span className="penidng">(Invite Pending)</span>
        }

        var result =
        <div data-name={fullName} data-email={email} className="Stakeholder row">
            <div className="container-fluid">
                <div>
                    <span className="participantName">{fullName}</span>
                    <span className={"roleName label " + roleClass}>{stakeholder.role}</span>
                </div>
                <div>
                    <span className="inviteStatus">{pendingText}</span>
                </div>
                <div>
                    <span className="email">{email}</span>
                </div>
            </div>
            <div className="">
                <button className="btn btn-block btn-outline-danger visible-hover"
                    onClick={this.deleteStakeholder}>
                        <i className="fa fa-trash delete-icon " ></i> Remove Stakeholder
                </button>

            </div>
        </div>

        return result;
    }
});
