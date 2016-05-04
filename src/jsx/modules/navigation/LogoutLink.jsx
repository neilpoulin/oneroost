import React from "react"
// import { browserHistory } from "react-router"
import Parse from "parse"

const LogoutLink = React.createClass({
    doLogout: function( e ){
        console.log("attempting to log out");
        e.preventDefault();
        Parse.User.logOut().done( function(){
            console.log("logged out successfully");
            /*
                need to remove this from local storage since ParseReact is fucking up logOut
                https://github.com/ParsePlatform/ParseReact/issues/161
            */
            localStorage.removeItem("Parse/" + OneRoost.Config.applicationId + "/currentUser");
            // browserHistory.push("/");
            window.location = "/";
        }).fail(function(error){
            console.log("failed to log out");
            console.error(error);
        });
    },
    render () {
        return (
            <a href="#" onClick={this.doLogout} {...this.props} >Logout</a>
        )
    }
})

export default LogoutLink
