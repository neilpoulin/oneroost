import React from "react"
import Parse from "parse"
// import RoostUtil from "./../util/RoostUtil.js"
import BasicInfo from "profile/BasicInfo"
import RoostNav from "RoostNav"
import PublicProfileLink from "profile/PublicProfileLink"

const ProfilePage = React.createClass({
    getCurrentUser(){
        return Parse.User.current().toJSON();
    },
    componentDidMount(){
        document.title= "My Account | OneRost";
    },
    render(){
        let userId = this.getCurrentUser().toJSON().objectId;
        var page =
        <div className="ProfilePage">
            <RoostNav showHome={true}/>
            <div className="container col-md-6 col-md-offset-3 col-lg-4 col-lg-offset-4">
                <h1 className="pageTitle">Account Settings</h1>
                <div className="section">
                    <BasicInfo user={this.getCurrentUser()}/>
                </div>
                <div className="section">
                    <h2>My Ready Roost Link</h2>
                    <p className="ReadyRoostLink link-container">
                        <PublicProfileLink userId={userId}/>
                    </p>
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
