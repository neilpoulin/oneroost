import React, {PropTypes} from "react";
import Parse from "parse";
import ParseReact from "parse-react";
import LinkedStateMixin from "react-addons-linked-state-mixin"
import RoostUtil from "./../util/RoostUtil"
import ReactGA from "react-ga"

export default React.createClass({
    mixins: [LinkedStateMixin],
    propTypes: {
        isEdit: PropTypes.bool
    },
    getDefaultProps(){
        return {
            isEdit: false
        }
    },
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
    submitRoost(){
        console.log("TODO: Submit the roost to cloud code");
        var self = this;
        var stakeholder = self.props.stakeholder;
        var deal = self.props.stakeholder.deal
        Parse.Cloud.run("submitReadyRoost", {
            dealId: deal.objectId || deal.id,
            stakeholderId: stakeholder.objectId || stakeholder.id
        }).then(function( result ) {
            console.log(result);
            alert("We have let " + RoostUtil.getFullName(stakeholder.user) + " know that the Roost is ready for them to review.")
            ParseReact.Mutation.Set(deal, {readyRoostSubmitted: new Date()}).dispatch();
            ReactGA.set({ userId: Parse.User.current().objectId });
            ReactGA.event({
              category: "ReadyRoost",
              action: "Submitted ReadyRoost"
            });
        });
    },
    render: function () {
        var stakeholder = this.props.stakeholder;
        var user = stakeholder.user;
        var fullName = RoostUtil.getFullName( user )
        var email = user.email || user.get("email")
        var company = null
        try{
            company = user.company || user.get("comapny")
        }
        catch(e){
            console.log("failed to get comapny from user object", user);
        }
        // var roleClass = stakeholder.role.toLowerCase();
        var pendingText = null;
        var deal = stakeholder.deal;

        var removeButton = null
        if ( this.props.isEdit )
        {
            removeButton =
            <button className="btn btn-outline-danger delete-button"
                onClick={this.deleteStakeholder}>
                    <i className="fa fa-times fa-fw" ></i>
            </button>;
        }

        //other actions might be "remind of invite, etc"
        var actionButton = null
        // var label = null
        // label = <span className={"roleName label " + roleClass}>{stakeholder.role}</span>

        if ( stakeholder.readyRoostApprover && !stakeholder.inviteAccepted && !deal.readyRoostSubmitted){
            actionButton =
            <button onClick={this.submitRoost} className="btn btn-primary">
                <i className="fa fa-check"></i> Submit Ready Roost
            </button>;
        }
        else if (stakeholder.readyRoostApprover && deal.readyRoostSubmitted && !stakeholder.inviteAccepted ){
            pendingText = <span>Ready Roost submitted on {RoostUtil.formatDate(deal.readyRoostSubmitted)}</span>
            actionButton = null;
        }
        else if ( !stakeholder.inviteAccepted ){
            pendingText = <span className="pending">(Invite Pending)</span>;
        }

        var result =
        <div data-name={fullName} data-email={email} className="Stakeholder row">
            <div className="">
                <div>
                    <span className="participantName">{fullName}</span>
                </div>
                <div>
                    <span className="company">{company}</span>
                </div>
                <div>
                    <span className="inviteStatus">{pendingText}</span>
                </div>
                <div className="">
                    {actionButton}
                </div>
            </div>
                {removeButton}
        </div>

        return result;
    }
});
