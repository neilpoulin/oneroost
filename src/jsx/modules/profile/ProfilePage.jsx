import React from "react"
import Parse from "parse"
// import RoostUtil from "./../util/RoostUtil.js"
import BasicInfo from "./BasicInfo"
import RoostNav from "./../navigation/RoostNav"
import PublicProfileLink from "./../profile/PublicProfileLink"

const ProfilePage = React.createClass({
    getCurrentUser(){
        return Parse.User.current();
    },
    render(){
        var page =
        <div className="ProfilePage">
            <RoostNav showHome={true}/>
            <div className="container col-md-6 col-md-offset-3">
                <h1 className="pageTitle">Account Settings</h1>
                <div className="section">                    
                    <BasicInfo user={this.getCurrentUser()}/>
                </div>
                <div className="section">
                    <h2>Links</h2>
                    <PublicProfileLink userId={this.getCurrentUser().id}>My Public Profile</PublicProfileLink>
                </div>
                <div className="section">
                    <h2>Email Preferences</h2>
                    <div>Coming soon</div>
                </div>

            </div>
        </div>

        return page
       }
});

export default ProfilePage
