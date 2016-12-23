import React, { PropTypes } from "react"
import Parse from "parse"
import {withRouter} from "react-router"
import ParseReact from "parse-react"
import {linkState} from "./util/LinkState"
import RoostUtil from "./util/RoostUtil"

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
            password: null,
            confirmPassword: null
        }
    },
    componentWillUpdate(props, state){
        if ( this.pendingQueries().length == 0 ) //stakeholder loaded
        {
            var stakeholder = this.data.stakeholder[0];
            var stakeholderUser = stakeholder.user;
            var currentUser = Parse.User.current();
            var dealId = stakeholder.deal.objectId;

            if ( stakeholder.inviteAccepted //if the invite is accepted
                || !currentUser && !stakeholderUser.passwordChangeRequired )  // OR the user needs to log in
                {
                    this.sendToRoost( dealId );
                }
            }
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
            var self = this;
            var stakeholder = this.data.stakeholder[0];
            var user = stakeholder.user;
            if ( user.passwordChangeRequired )
            {
                Parse.Cloud.run("saveNewPassword", {
                    password: self.state.password,
                    stakeholderId: stakeholder.objectId,
                    userId: user.objectId
                })
                .then( function(result) {
                    ParseReact.Mutation.Set(stakeholder, {inviteAccepted: true}).dispatch();
                    Parse.User.logIn(user.email, self.state.password, {
                        success: function(){
                            self.sendToRoost( self.data.stakeholder[0].deal.objectId )
                        },
                        error: function(){
                            console.log("failed to log in after changing password");
                        }
                    });
                },
                function(error) {
                    console.log("Something went wrong", error);
                }
            );
        }
        else {
            self.props.router.replace("/roosts/" + self.data.stakeholder[0].deal.objectId )
        }
    },
    render () {
        if ( this.pendingQueries().length > 0 )
        {
            return <div>Loading....</div>
        }
        else if ( this.data.stakeholder.length == 0)
        {
            return <div>No invites found for that ID</div>
        }
        var stakeholder = this.data.stakeholder[0];
        var currentUser = Parse.User.current();

        var form = null
        if ( stakeholder.user.passwordChangeRequired )
        {

            form =
            <div className="row-fluid">
                <div className="container-fluid">
                    <p>
                        To get started with One Roost, just create a password below
                    </p>
                </div>
                <div className="container-fluid">
                    <div className="form-group">
                        <label htmlFor="nextStepTitle" className="control-label">Create a Password</label>
                        <input id="createPassword"
                            type="password"
                            className="form-control"
                            value={this.state.password}
                            onChange={linkState(this,"password")}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="nextStepTitle" className="control-label">Confirm Password</label>
                        <input id="confirmPassword"
                            type="password"
                            className="form-control"
                            value={this.state.confirmPassword}
                            onChange={linkState(this,"confirmPassword")}/>
                    </div>
                    <div className="form-group">
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
        <div className="container col-md-6 col-md-offset-3">
            <div className="row-fluid">
                <div className="container-fluid">
                    <h2>Invitation to OneRoost</h2>
                    <p className="lead">
                        <span className="">{stakeholder.user.firstName} {stakeholder.user.lastName},</span>
                        <br/>
                        {RoostUtil.getFullName(stakeholder.invitedBy)} from {stakeholder.invitedBy.company} has invited to you join {stakeholder.deal.dealName} on OneRoost
                    </p>
                </div>
            </div>
            {form}
        </div>

        return result;
    }
}) )

export default Invitation
