import React from "react"
import PropTypes from "prop-types"
import {withRouter} from "react-router"
import * as RoostUtil from "RoostUtil"
import FormInputGroup from "FormInputGroup"
import FormUtil from "FormUtil"
import LoadingIndicator from "LoadingIndicator"
import {confirmValidation} from "InvitationValidation"
import Logo from "Logo"
import RoostNav from "RoostNav"
import {connect} from "react-redux"
import {denormalize} from "normalizr"
import * as Stakeholder from "models/Stakeholder"
import * as Deal from "models/Deal"
import * as User from "models/User"
import {loadInvitationByStakeholderId, submitInviteAccept} from "ducks/invitation"
import Unauthorized from "Unauthorized"

const Invitation = withRouter(React.createClass({
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
            password: "",
            confirmPassword: "",
            stakeholder: null,
            loading: true,
            errors: {}
        }
    },
    componentWillMount(){
        this.props.loadData()
    },
    componentWillUpdate(nextProps, nextState){
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
    sendToUnauthorized(){
        this.props.router.replace("/roosts/unauthorized")
    },
    sendToRoost(roostId) {
        this.props.router.replace("/roosts/" + roostId)
    },
    submit: function(){
        let self = this;
        const {stakeholder} = this.props
        const {user, deal} = stakeholder
        const {password} = this.state

        let validation = {};
        if (user.passwordChangeRequired){
            validation = confirmValidation;
        }
        let errors = FormUtil.getErrors(this.state, validation);
        if (!FormUtil.hasErrors(errors)){
            this.props.acceptInvite(stakeholder, password).then(() => {
                self.sendToRoost(deal.objectId)
            })
        }
        else {
            this.setState({errors: errors})
        }
    },
    render () {
        const {isLoading,
            stakeholder,
            roost,
            inviteAccepted,
            currentUserId,
            isSaving,
            isLoggedIn} = this.props;
        const {errors, password, confirmPassword} = this.state;
        if (isLoading) {
            return (
                <div>
                    <RoostNav/>
                    <div className="container col-md-4 col-md-offset-4">
                        <div className="row-fluid">
                            <div className="container-fluid text-center">
                                <Logo className="header"/>
                                <LoadingIndicator message="Loading..."/>
                            </div>
                        </div>
                    </div>
                </div>)
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
        else if (isLoggedIn && currentUserId !== stakeholder.user.objectId){
            return <Unauthorized/>
        }
        else if (!stakeholder.user.passwordChangeRequired && !isLoggedIn && !inviteAccepted || inviteAccepted){
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

        let deal = stakeholder.deal
        var form = null
        if (stakeholder.user.passwordChangeRequired) {
            form =
            <div className="row-fluid">
                <div className="container-fluid">
                    <p>
                        {"To get started with One Roost, just create a password below"}
                    </p>
                </div>
                <div className="container-fluid">
                    <FormInputGroup
                        fieldName="password"
                        value={password}
                        label="Create a Password"
                        onChange={val => this.setState({password: val})}
                        type="password"
                        errors={errors}
                        required={true}
                        />
                    <FormInputGroup
                        fieldName="confirmPassword"
                        value={confirmPassword}
                        label="Confirm Password"
                        onChange={val => this.setState({confirmPassword: val})}
                        type="password"
                        required={true}
                        errors={errors}
                        />
                    <div className="">
                        <button className="btn btn-success btn-block" onClick={this.submit}>Accept Invite</button>
                    </div>
                </div>

            </div>
        }
        else if(stakeholder.user && !stakeholder.user.passwordChangeRequired){
            form =
            <div className = "form">
                <div className="form-group">
                    <button className="btn btn-success btn-block" onClick={this.submit}>Accept Invite</button>
                </div>
            </div>
        }

        let savingIndicator = null
        if (isSaving){
            savingIndicator = <LoadingIndicator message="Saving..."/>
        }

        var result =
        <div>
            <RoostNav/>
            <div className="container col-md-4 col-md-offset-4">
                <div className="row-fluid">
                    <div className="container-fluid">
                        <Logo className="header"/>
                        <p className="lead">
                            <span className="">{stakeholder.user.firstName},</span>
                            <br/>
                            {RoostUtil.getFullName(stakeholder.invitedBy)}<span display-if={stakeholder.user.company}> from {stakeholder.user.company}</span> has invited to you take part in an opportunity.
                        </p>
                    </div>
                </div>
                {form}
                {savingIndicator}
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
    let isSaving = false

    if (invitation && !invitation.isLoading && invitation.hasLoaded){
        isLoading = invitation.isLoading
        isSaving = invitation.isSaving
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
        isSaving,
        isLoggedIn: currentUser.isLoggedIn,
        currentUserId: currentUser.userId,
        inviteAccepted
    }
}
const mapDispatchToProps = (dispatch, ownProps) => {
    let stakeholderId = ownProps.params.stakeholderId
    return {
        loadData: () => {
            dispatch(loadInvitationByStakeholderId(stakeholderId))
        },
        acceptInvite: (stakeholder, password) => {
            return dispatch(submitInviteAccept(stakeholder, password))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Invitation)
