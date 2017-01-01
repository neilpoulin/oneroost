import React, { PropTypes } from "react"
import Parse from "parse"
import {withRouter} from "react-router"
import ParseReact from "parse-react"
import RoostUtil from "RoostUtil"
import FormInputGroup from "FormInputGroup"
import FormUtil from "FormUtil"
import {loginValidatoin, confirmValidation} from "InvitationValidation"
import Logo from "Logo"
import RoostNav from "RoostNav"

const Invitation = withRouter( React.createClass({
    mixins: [ParseReact.Mixin],
    propTypes: {
        router: PropTypes.object.isRequired
    },
    observe: function(props, state){
        var stakeholderQuery = new Parse.Query("Stakeholder");
        stakeholderQuery.include("user");
        stakeholderQuery.include("deal");
        stakeholderQuery.include("invitedBy");
        stakeholderQuery.equalTo("objectId", props.params.stakeholderId);
        stakeholderQuery
        return {
            stakeholder: stakeholderQuery
        }
    },
    getInitialState: function(){
        return {
            password: "",
            confirmPassword: "",
            errors: {}
        }
    },
    componentWillUpdate(props, state){
        if ( this.pendingQueries().length == 0 && this.data.stakeholder.length > 0 ){ //stakeholder loaded
            var stakeholder = this.data.stakeholder[0];
            var stakeholderUser = stakeholder.user;
            var currentUser = Parse.User.current();
            var dealId = stakeholder.deal.objectId;

            if ( currentUser && stakeholderUser.objectId !== currentUser.id ){
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

        var toSave = this.data.stakeholder[0].id;

        ParseReact.Mutation
        .Set(toSave, {inviteAccepted: true})
        .dispatch({waitForServer: true});
        self.sendToRoost( self.data.stakeholder[0].deal.objectId );
    },
    submitPassword: function(){
        let self = this;
        let stakeholder = this.data.stakeholder[0];
        let dealId = stakeholder.deal.objectId;
        let user = stakeholder.user;
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
                    ParseReact.Mutation.Set(stakeholder, {inviteAccepted: true}).dispatch();
                    Parse.Cloud.run("getUserWithEmail", {userId: userId})
                    .then(function(emailUser){
                        let email = emailUser.user.get("email");
                        Parse.User.logIn(email, self.state.password, {
                            success: function(){
                                self.sendToRoost(dealId)
                            },
                            error: function(){
                                console.log("failed to log in after changing password");
                            }
                        });
                    })
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
        if ( this.pendingQueries().length > 0 )
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
        else if ( this.data.stakeholder.length == 0)
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
        var stakeholder = this.data.stakeholder[0];
        var currentUser = Parse.User.current();
        let {errors, password, confirmPassword} = this.state;
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
                            <span className="">{stakeholder.user.firstName} {stakeholder.user.lastName},</span>
                            <br/>
                            {RoostUtil.getFullName(stakeholder.invitedBy)} from {stakeholder.invitedBy.company} has invited to you join {stakeholder.deal.dealName} on OneRoost
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
