import React, {PropTypes} from "react"
import {connect} from "react-redux"
import * as RoostUtil from "RoostUtil"
import BasicInfo from "profile/BasicInfo"
import RoostNav from "RoostNav"
import {saveUser, fetchUserPermissions} from "ducks/user"
import {loadTemplates} from "ducks/userTemplates"
import {denormalize} from "normalizr"
import * as Template from "models/Template"
import * as AccountSeat from "models/AccountSeat"
import OpportunityTemplate from "profile/OpportunityTemplate"

const ProfilePage = React.createClass({
    propTypes: {
        user: PropTypes.object,
        templatesLoading: PropTypes.bool,
        templates: PropTypes.arrayOf(PropTypes.object),
        archivedTemplates: PropTypes.arrayOf(PropTypes.object),
        loadData: PropTypes.func.isRequired,
        saveUser: PropTypes.func.isRequired,
    },
    getCurrentUser(){
        return this.props.user;
    },
    componentDidMount(){
        document.title= "My Account | OneRost";
        let userId = this.props.user.objectId
        this.props.loadData(userId)
    },
    render(){
        const {user, templates} = this.props
        var page =
        <div className="ProfilePage">
            <RoostNav showHome={true}/>
            <div className="container col-md-6 col-md-offset-3 col-lg-4 col-lg-offset-4">
                <h1 className="pageTitle">Account Settings</h1>
                <div className="section">
                    <BasicInfo user={this.getCurrentUser()} saveUser={this.props.saveUser}/>
                </div>
                <div className="section">
                    <h2>RFP Templates</h2>
                    <div>
                        Need to make a change or add a template? Contact <a href="mailto:support@oneroost.com">support@oneroost.com</a>.
                        {templates.map((template, i) => {
                            return <OpportunityTemplate
                                template={template}
                                user={user}
                                key={"template_" + i}
                                />
                        })}
                    </div>
                </div>
                <div className="section">
                    <h2>Email Preferences</h2>
                    <div>Coming Soon</div>
                </div>

            </div>
        </div>

        return page
    }
});

const mapStateToProps = (state, ownProps) => {
    const templatesByUser = state.templatesByUser.toJS()
    const seatId = state.user.get("seatId")
    const user = RoostUtil.getCurrentUser(state);
    const userId = user.objectId
    const myTemplates = templatesByUser[userId]
    const entities = state.entities.toJS()
    let templatesLoading = false;
    let templates = []
    let archivedTemplates = []
    if (myTemplates){
        templatesLoading = myTemplates.isLoading;
        templates = denormalize(myTemplates.templateIds, [Template.Schema], entities)
        archivedTemplates = denormalize(myTemplates.archivedTemplateIds, [Template.Schema], entities)
    }
    let seat = null
    if (seatId){
        seat = denormalize(seatId, AccountSeat.Schema, entities)
        user.seat = seat
    }
    return {
        user,
        seat,
        templatesLoading,
        templates,
        archivedTemplates,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        saveUser: (changes) => dispatch(saveUser(changes)),
        loadData: (userId) => {
            dispatch(loadTemplates(userId))
            dispatch(fetchUserPermissions())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage)
