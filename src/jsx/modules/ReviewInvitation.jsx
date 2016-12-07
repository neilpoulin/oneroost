import React, { PropTypes } from "react"
import Parse from "parse"
import {withRouter} from "react-router"
import ParseReact from "parse-react"
import LinkedStateMixin from "react-addons-linked-state-mixin"

const ReviewInvitation = withRouter( React.createClass({
    mixins: [ParseReact.Mixin,LinkedStateMixin],
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
        if ( this.pendingQueries().length == 0 ) {
            var stakeholder = this.data.stakeholder[0];
            var stakeholderUser = stakeholder.user;
            var currentUser = Parse.User.current();
            var dealId = stakeholder.deal.objectId;

            if ( stakeholder.inviteAccepted || !currentUser && !stakeholderUser.passwordChangeRequired )  // OR the user needs to log in
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
        <div className="container col-md-6 col-md-offset-3">
            <div className="row-fluid">
                <div className="container-fluid">
                    <h2>Review Opportunity</h2>
                    <p className="lead">
                        <span className="">{stakeholder.user.firstName},</span>
                        <br/>
                        {stakeholder.invitedBy.firstName} {stakeholder.invitedBy.lastName} from {stakeholder.invitedBy.company} has submitted a proposal called <i>{stakeholder.deal.dealName}</i> for you to review
                    </p>
                </div>
            </div>
            <div className = "form">
                <div className="form-group">
                    <button className="btn btn-success btn-block" onClick={this.acceptInvite}>View Proposal</button>
                </div>
            </div>
        </div>

        return result;
    }
}) )

export default ReviewInvitation
