import React, {PropTypes} from "react"
import {connect} from "react-redux"
import * as RoostUtil from "RoostUtil"
import BasicInfo from "profile/BasicInfo"
import RoostNav from "RoostNav"
import {saveUser} from "ducks/user"
import PublicProfileLink from "profile/PublicProfileLink"

const ProfilePage = React.createClass({
    propTypes: {
        user: PropTypes.object
    },
    getCurrentUser(){
        return this.props.user;
    },
    componentDidMount(){
        document.title= "My Account | OneRost";
    },
    render(){
        let userId = this.getCurrentUser().objectId;
        var page =
        <div className="ProfilePage">
            <RoostNav showHome={true}/>
            <div className="container col-md-6 col-md-offset-3 col-lg-4 col-lg-offset-4">
                <h1 className="pageTitle">Account Settings</h1>
                <div className="section">
                    <BasicInfo user={this.getCurrentUser()} saveUser={this.props.saveUser}/>
                </div>
                <div className="section">
                    <h2>My Ready Roost Link</h2>
                    <p className="ReadyRoostLink link-container">
                        <PublicProfileLink userId={userId}/>
                    </p>
                </div>
                <div className="section">
                    <h2>RFP Requirements</h2>
                    <div>Coming Soon</div>
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
    return {
        user: RoostUtil.getCurrentUser(state)
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        saveUser: (changes) => dispatch(saveUser(changes))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage)
