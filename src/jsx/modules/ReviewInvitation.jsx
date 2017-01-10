import React, { PropTypes } from "react"
import Parse from "parse"
import {withRouter} from "react-router"
import RoostUtil from "RoostUtil"

const ReviewInvitation = withRouter( React.createClass({
    propTypes: {
        router: PropTypes.object.isRequired,
        params: PropTypes.shape({
            stakeholderId: PropTypes.string.isRequired
        })
    },
    fetchData(stakeholderId){
        let self = this;
        var stakeholderQuery = new Parse.Query("Stakeholder");
        stakeholderQuery.include("user");
        stakeholderQuery.include("deal");
        stakeholderQuery.include("invitedBy");
        stakeholderQuery.get(stakeholderId).then(stakeholder => {
            self.setState({
                loading: false,
                stakeholder: stakeholder
            })
        }).catch(error => {
            console.log("failed to get stakeholder", error);
            self.setState({
                loading: false,
                stakeholder: false
            })
        })
    },
    getInitialState: function(){
        return {
            password: null,
            confirmPassword: null,
            stakeholder: null,
            loading: true,
        }
    },
    componentWillMount(){
        this.fetchData(this.props.params.stakeholderId)
    },
    componentWillUpdate(props, state){
        if (!this.state.loading) {
            var stakeholder = this.state.stakeholder;
            var stakeholderUser = stakeholder.get("user");
            var currentUser = Parse.User.current();
            var dealId = stakeholder.get("deal").id;

            if ( stakeholder.get("inviteAccepted") || !currentUser && !stakeholderUser.get("passwordChangeRequired") )  // OR the user needs to log in
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

        let stakeholder = this.state.stakeholder;
        stakeholder.set("inviteAccepted", true);
        stakeholder.save().then(result => {
            self.sendToRoost( stakeholder.get("deal").id );
        }).catch(error => console.error("failed to save the stakeholder", error))
    },
    render () {
        let stakeholder = this.state.stakeholder;
        if (this.state.loading)
        {
            return <div>Loading....</div>
        }
        else if (!stakeholder)
        {
            return <div>No invites found for that ID</div>
        }

        var result =
        <div className="container col-md-6 col-md-offset-3">
            <div className="row-fluid">
                <div className="container-fluid">
                    <h2>Review Opportunity</h2>
                    <p className="lead">
                        <span className="">{stakeholder.get("user").get("firstName")},</span>
                        <br/>
                        {RoostUtil.getFullName(stakeholder.get("invitedBy"))} from {stakeholder.get("invitedBy").get("company")} has submitted a proposal called <i>{stakeholder.get("deal").get("dealName")}</i> for you to review
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
