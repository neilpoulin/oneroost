import React from "react"
import PropTypes from "prop-types"
import {connect} from "react-redux"
import {withRouter} from "react-router"
import * as RoostUtil from "RoostUtil"
import {denormalize} from "normalizr"
import * as Stakeholder from "models/Stakeholder"
import * as Deal from "models/Deal"
import * as User from "models/User"
import Logo from "Logo"
import RoostNav from "RoostNav"
import {loadInvitationByStakeholderId, acceptInvite} from "ducks/invitation"
import LoadingIndicator from "LoadingIndicator"

const ReviewInvitation = withRouter(React.createClass({
    propTypes: {
        router: PropTypes.object.isRequired,
        params: PropTypes.shape({
            stakeholderId: PropTypes.string.isRequired
        }),
        isLoading: PropTypes.bool.isRequired,
        roost: PropTypes.object,
        invitedBy: PropTypes.object,
        stakeholder: PropTypes.object,
        isLoggedIn: PropTypes.bool,
        inviteAccepted: PropTypes.bool,
    },
    getDefaultProps(){
        return {
            isLoading: true,
            isLoggedIn: false,
        }
    },
    getInitialState: function(){
        return {
            password: null,
            confirmPassword: null,
            stakeholder: null,
            loading: true,
        }
    },
    componentDidMount(){
        this.props.loadData()
    },
    componentWillUpdate(props, state){
        if (!this.props.isLoading) {
            const {stakeholder, isLoggedIn, roost} = this.props;
            var stakeholderUser = stakeholder.user
            var dealId = roost.objectId;

            if (stakeholder.inviteAccepted || !isLoggedIn && !stakeholderUser.passwordChangeRequired)  // OR the user needs to log in
            {
                this.sendToRoost(dealId);
            }
        }
    },
    sendToRoost(roostId) {
        this.props.router.replace("/roosts/" + roostId)
    },
    acceptInvite: function(){
        let stakeholder = this.props.stakeholder;
        this.props.acceptInvite(stakeholder)
    },
    render () {
        const {isLoading, stakeholder, invitedBy, roost, inviteAccepted, isLoggedIn} = this.props;

        if (isLoading) {
            return <div>
                <RoostNav/>
                <LoadingIndicator/>
            </div>
        }
        else if (!stakeholder) {
            return (
                <div>
                    <RoostNav/>
                    <div className="container col-md-4 col-md-offset-4">
                        <div className="row-fluid">
                            <div className="container-fluid text-center">
                                <Logo className="header"/>
                                <div>No invites found for that ID</div>
                            </div>
                        </div>
                    </div>
                </div>)
        }
        else if (!isLoggedIn || inviteAccepted){
            this.sendToRoost(roost.objectId)
            return (
                <div>
                    <RoostNav/>
                    <div className="container col-md-4 col-md-offset-4">
                        <div className="row-fluid">
                            <div className="container-fluid text-center">
                                <Logo className="header"/>
                                <LoadingIndicator message="Redirecting to Login"/>
                            </div>
                        </div>
                    </div>
                </div>)
        }

        var result =
        <div className="container col-md-6 col-md-offset-3">
            <RoostNav/>
            <div className="row-fluid">
                <div className="container-fluid">
                    <h2>Review {roost.dealName} Opportunity</h2>
                    <p className="lead">
                        <span className="">{stakeholder.user.firstName},</span>
                        <br/>
                        {RoostUtil.getFullName(invitedBy)} at {invitedBy.company} has submitted an opportunity for you to review.

                    </p>
                </div>
            </div>
            <div className = "form">
                <div className="form-group">
                    <button className="btn btn-success btn-block" onClick={this.acceptInvite}>View Opportunity</button>
                </div>
            </div>
        </div>

        return result;
    }
}))

const mapStateToProps = (state, ownProps) => {
    let entities = state.entities.toJS()
    let invitationByStakeholder = state.invitationsByStakeholder.toJS()
    let currentUser = state.user.toJS()
    let stakeholderId = ownProps.params.stakeholderId
    let invitation = invitationByStakeholder[stakeholderId]
    let stakeholder = null
    let roost = null
    let invitedBy = null
    let isLoading = true
    let inviteAccepted = false

    if (invitation && !invitation.isLoading && invitation.hasLoaded){
        isLoading = invitation.isLoading
        stakeholder = denormalize(invitation.stakeholderId, Stakeholder.Schema, entities)
        roost = denormalize(invitation.dealId, Deal.Schema, entities)
        invitedBy = denormalize(invitation.invitedBy, User.Schema, entities)
        inviteAccepted = invitation.inviteAccepted
    }

    return {
        isLoading,
        stakeholder,
        invitedBy,
        roost,
        isLoggedIn: currentUser.isLoggedIn,
        inviteAccepted
    }
}
const mapDispatchToProps = (dispatch, ownProps) => {
    let stakeholderId = ownProps.params.stakeholderId
    return {
        loadData: () => {
            dispatch(loadInvitationByStakeholderId(stakeholderId))
        },
        acceptInvite: (stakeholder) => {
            dispatch(acceptInvite(stakeholder))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReviewInvitation)
