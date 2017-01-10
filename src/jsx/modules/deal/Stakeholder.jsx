import React, {PropTypes} from "react";
import Parse from "parse";
import ParseReact from "parse-react";
import RoostUtil from "RoostUtil"
import ReactGA from "react-ga"

export default React.createClass({
    propTypes: {
        isEdit: PropTypes.bool,
        stakeholder: PropTypes.instanceOf(Parse.Object).isRequired,
        deal: PropTypes.instanceOf(Parse.Object).isRequired,
    },
    getDefaultProps(){
        return {
            isEdit: false
        }
    },
    deleteStakeholder: function () {
        var self = this;
        var {stakeholder} = this.props;
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
        var {deal} = this.props;
        var user = Parse.User.current();
        let stakeholderUser = stakeholder.get("user");
        var fullName = RoostUtil.getFullName(user)
        var message = fullName + " removed a stakeholder: " + RoostUtil.getFUllName(stakeholderUser) + " (" + stakeholder.user.email + ")";

        var comment = {
            deal: deal,
            message: message,
            author: null,
            username: "OneRoost Bot",
            navLink: {type:"participant"}
        };
        ParseReact.Mutation.Create("DealComment", comment).dispatch();
    },
    submitRoost(){
        var self = this;
        var {stakeholder, deal} = self.props
        Parse.Cloud.run("submitReadyRoost", {
            dealId: deal.id,
            stakeholderId: stakeholder.id
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
        var {stakeholder, isEdit, deal} = this.props;
        var user = stakeholder.get("user");
        var fullName = RoostUtil.getFullName( user )
        var email = user.get("email") || user.get("username")
        var company = user.get("company")        
        // var roleClass = stakeholder.role.toLowerCase();
        var pendingText = null;

        var removeButton = null
        if ( isEdit ){
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

        if ( stakeholder.get("readyRoostApprover") && !stakeholder.get("inviteAccepted") && !deal.get("readyRoostSubmitted")){
            actionButton =
            <button onClick={this.submitRoost} className="btn btn-primary">
                <i className="fa fa-check"></i> Submit Ready Roost
            </button>;
        }
        else if (stakeholder.get("readyRoostApprover") && deal.get("readyRoostSubmitted") && !stakeholder.get("inviteAccepted") ){
            pendingText = <span>Ready Roost submitted on {RoostUtil.formatDate(deal.get("readyRoostSubmitted"))}</span>
            actionButton = null;
        }
        else if ( !stakeholder.get("inviteAccepted") ){
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
