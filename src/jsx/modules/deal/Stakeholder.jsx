import React, {PropTypes} from "react";
import * as RoostUtil from "RoostUtil"

const Stakeholder = React.createClass({
    propTypes: {
        isEdit: PropTypes.bool,
        stakeholder: PropTypes.object.isRequired,
        deal: PropTypes.object.isRequired,
        removeStakeholder: PropTypes.func.isRequired,
        submitReadyRoost: PropTypes.func.isRequired
    },
    getDefaultProps(){
        return {
            isEdit: false
        }
    },
    deleteStakeholder: function () {
        var {stakeholder} = this.props;
        var confirm = window.confirm("Are you sure you want to remove this user?" );
        if ( confirm ){
            this.props.removeStakeholder(stakeholder)
        }
    },
    submitRoost(){
        var self = this;
        var {stakeholder, deal} = self.props
        this.props.submitReadyRoost(stakeholder, deal)
    },
    render: function () {
        var {stakeholder, isEdit, deal} = this.props;
        var user = stakeholder.user
        var fullName = RoostUtil.getFullName( user )
        var email = user.email || user.username
        var company = user.company
        // var roleClass = stakeholder.role.toLowerCase();
        var pendingText = null;
        var inactive = stakeholder.active === false;
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

        if ( stakeholder.readyRoostApprover && !stakeholder.inviteAccepted && !deal.readyRoostSubmitted ){
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
        <div data-name={fullName} data-email={email} className={"Stakeholder row " + (inactive ? "inactive" : "") }>
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

export default Stakeholder;
