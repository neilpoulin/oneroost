import React, { PropTypes } from "react"
import Parse from "parse"
import {withRouter} from "react-router"
import ParseReact from "parse-react"
import LinkedStateMixin from "react-addons-linked-state-mixin"

const Invitation = withRouter( React.createClass({
    mixins: [ParseReact.Mixin,LinkedStateMixin],
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
        if ( this.pendingQueries().length == 0 && (Parse.User.current() ||
                !this.data.stakeholder[0].user.passwordChangeRequired ||
                !this.data.stakeholder[0].inviteAccepted) )
        {
            debugger;
            this.props.router.replace("/roosts/" + this.data.stakeholder[0].deal.objectId )
        }
    },
    submit: function(){
        console.log("saving password...");
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
                    console.log("Password changed", result);
                    ParseReact.Mutation.Set(stakeholder, {inviteAccepted: true}).dispatch();
                    Parse.User.logIn(user.email, self.state.password, {
                        success: function(){
                            console.log("logged in after creating new password, user: ", Parse.User.current());
                            self.props.router.replace("/roosts/" + self.data.stakeholder[0].deal.objectId )
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
        var result =
        <div className="container">
            <div className="row">
                {stakeholder.user.firstName} {stakeholder.user.lastName},
                <br/>
                {stakeholder.invitedBy.firstName} {stakeholder.invitedBy.lastName} has invited to you join {stakeholder.deal.dealName} on OneRoost
            </div>
            <div className="row">
                <div className="form-group">
                    <label htmlFor="nextStepTitle">Crate a Password</label>
                    <input id="createPassword"
                        type="text"
                        className="form-control"
                        valueLink={this.linkState("password")}/>
                </div>
                <div className="form-group">
                    <label htmlFor="nextStepTitle">Confirm Password</label>
                    <input id="confirmPassword"
                        type="text"
                        className="form-control"
                        valueLink={this.linkState("confirmPassword")}/>
                </div>
                <div className="form-group">
                    <button className="btn btn-success" onClick={this.submit}>Accept</button>
                </div>
            </div>

        </div>
        return result;
    }
}) )

export default Invitation
