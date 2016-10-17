import React from "react"
import Parse from "parse"
import RoostUtil from "./../util/RoostUtil.js"
import BasicInfo from "./BasicInfo"
import RoostNav from "./../navigation/RoostNav";

const ProfilePage = React.createClass({
    getCurrentUser(){
        return Parse.User.current();
    },
    render(){
        var page =
        <div className="ProfilePage">
            <RoostNav showHome={true}/>
            <div className="container">
                <h1 className="pageTitle">My Account</h1>
                <div className="section">
                    <h2>Basic Info</h2>
                    <BasicInfo user={this.getCurrentUser()}/>
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
