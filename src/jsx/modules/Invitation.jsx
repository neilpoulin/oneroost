import React, { PropTypes } from "react"
import Parse from "parse"
import {withRouter} from "react-router"
import RoostUtil from "RoostUtil"
import FormInputGroup from "FormInputGroup"
import FormUtil from "FormUtil"
import {loginValidatoin, confirmValidation} from "InvitationValidation"
import Logo from "Logo"
import RoostNav from "RoostNav"

const Invitation = withRouter( React.createClass({
    propTypes: {
        router: PropTypes.object.isRequired,
        params: PropTypes.shape({
            stakeholderId: PropTypes.string.isRequired
        })
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
    fetchData(stakeholderId){
        var stakeholderQuery = new Parse.Query("Stakeholder");
        let self = this;
        stakeholderQuery.include("user");
        stakeholderQuery.include("deal");
        stakeholderQuery.include("invitedBy");
        stakeholderQuery.get(stakeholderId).then(stakeholder => {
            self.setState({
                stakeholder: stakeholder,
                loading: false,
            })
        }).catch(error => {
            console.log(error);
            self.setState({
                stakeholder: null,
                loading: false,
            })
        });
    },
    componentWillMount(){
        let stakeholderId = this.props.params.stakeholderId;
        console.log("component will mount, stakeholderId = ", stakeholderId)
        this.fetchData(stakeholderId)
    },
    componentWillUpdate(nextProps, nextState){
        if ( this.props.params.stakeholderId !== nextProps.params.stakeholderId ){
            let stakeholderId = nextProps.params.stakeholderId;
            this.setState({
                loading: true,
                stakeholder: null
            });
            console.log("component will update, new stakeholder id different than previous", stakeholderId)
            this.fetchData(stakeholderId)
        }

        if ( !this.state.loading && this.state.stakeholder ){ //stakeholder loaded
            var stakeholder = this.state.stakeholder;
            var stakeholderUser = stakeholder.user
            var currentUser = Parse.User.current().toJSON();
            var dealId = stakeholder.deal.objectId;

            if ( currentUser && stakeholderUser.objectId !== currentUser.objectId ){
                this.sendToUnauthorized();
                return;
            }

            if ( stakeholder.inviteAccepted || !currentUser && !stakeholderUser.passwordChangeRequired ){  // OR the user needs to log in
                this.sendToRoost( dealId );
            }
        }
    },
    sendToUnauthorized(){
        this.props.router.replace("/roosts/unauthorized" )
    },
    sendToRoost( roostId )
    {
        this.props.router.replace("/roosts/" + roostId )
    },
    acceptInvite: function(){
        var self = this;
        let stakeholder = this.state.stakeholder;
        stakeholder.set("inviteAccepted", true);
        stakeholder.save().then(response => {
            self.sendToRoost(stakeholder.deal.objectId)}
        )
    },
    submitPassword: function(){
        let self = this;
        let stakeholder = this.state.stakeholder;
        let deal = stakeholder.deal
        let dealId = deal.objectId;
        let user = stakeholder.user
        let userId = user.objectId;
        let validation = loginValidatoin;
        if ( user.passwordChangeRequired ){
            validation = confirmValidation;
        }
        let errors = FormUtil.getErrors(this.state, validation);
        console.log(errors);
        if ( !FormUtil.hasErrors(errors) ){
            if ( user.passwordChangeRequired ){
                Parse.Cloud.run("saveNewPassword", {
                    password: self.state.password,
                    stakeholderId: stakeholder.objectId,
                    userId: userId
                })
                .then( function(result) {
                    stakeholder.set("inviteAccepted", true);
                    stakeholder.save().then(result => {
                        Parse.Cloud.run("getUserWithEmail", {userId: userId})
                        .then(function(emailUser){
                            emailUser = emailUser.toJSON()
                            let email = emailUser.user.email
                            Parse.User.logIn(email, self.state.password, {
                                success: function(){
                                    self.sendToRoost(dealId)
                                },
                                error: function(){
                                    console.log("failed to log in after changing password");
                                }
                            });
                        });
                    }).catch(error => console.error("error saving stakeholder", error));
                },
                function(error) {
                    console.log("Something went wrong", error);
                });
            }
            else {
                self.sendToRoost(dealId)
            }
            self.setState({errors: {}});
            return true;
        }
        self.setState({errors: errors});
        return false;
    },
    render () {
        if ( this.state.loading )
        {
            return (
                <div>
                    <RoostNav/>
                    <div className="container col-md-4 col-md-offset-4">
                        <div className="row-fluid">
                            <div className="container-fluid">
                                <Logo className="header"/>
                                <div className="container col-md-4 col-md-offset-4"><i className="fa fa-spin fa-spinner"></i> Loading...</div>
                            </div>
                        </div>
                    </div>
                </div>)
        }
        else if (!this.state.stakeholder)
        {
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
        let {errors, password, confirmPassword, stakeholder} = this.state;
        var currentUser = Parse.User.current();
        let deal = stakeholder.deal
        var form = null
        if ( stakeholder.user.passwordChangeRequired )
        {
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
                        <button className="btn btn-success btn-block" onClick={this.submitPassword}>Accept Invite</button>
                    </div>
                </div>

            </div>
        }
        else if( currentUser && !currentUser.passwordChangeRequired ){
            form =
            <div className = "form">
                <div className="form-group">
                    <button className="btn btn-success btn-block" onClick={this.acceptInvite}>Accept Invite</button>
                </div>
            </div>
        }

        var result =
        <div>
            <RoostNav/>
            <div className="container col-md-4 col-md-offset-4">
                <div className="row-fluid">
                    <div className="container-fluid">
                        <Logo className="header"/>
                        <p className="lead">
                            <span className="">{RoostUtil.getFullName(stakeholder.user)},</span>
                            <br/>
                            {RoostUtil.getFullName(stakeholder.invitedBy)} from {stakeholder.invitedBycompany} has invited to you join {deal.dealName} on OneRoost
                        </p>
                    </div>
                </div>
                {form}
            </div>
        </div>

        return result;
    }
}) )

export default Invitation
