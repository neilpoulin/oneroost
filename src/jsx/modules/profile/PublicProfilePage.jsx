import React, { PropTypes } from "react"
import {linkState} from "./../util/LinkState"
import RoostNav from "./../navigation/RoostNav";
import ParseReact from "parse-react"
import Parse from "parse"
import LoadingTakeover from "./../util/LoadingTakeover"
import RoostUtil from "./../util/RoostUtil"
import FourOhFourPage from "./../FourOhFourPage"
import LoginComponent from "./../LoginComponent"
import ReactGA from "react-ga"
import { withRouter } from "react-router"

const PublicProfilePage = withRouter( React.createClass({
    mixins: [ParseReact.Mixin],
    propTypes: {
        params: PropTypes.shape({
            userId: PropTypes.string.isRequired
        }).isRequired
    },
    observe(props, state){
        var userId= props.params.userId;
        return {
            profileUser: (new Parse.Query("User")).equalTo( "objectId", userId )
        }
    },
    getInitialState(){
        return {
            currentUser: Parse.User.current(),
            roostName: null,
            canSubmit: false,
            error: null
        }
    },
    loginSuccess(){
        console.log("login success");

        ReactGA.event({
          category: "ReadyRoost",
          action: "Log in"
        });
        this.setState({currentUser: Parse.User.current()});
    },
    logoutSuccess(){
        console.log("logout success")
        this.setState({currentUser: null})
    },
    createReadyRoost(){
        var profileUserId = this.props.params.userId
        var self = this;
        Parse.Cloud.run("createReadyRoost", {
            profileUserId: profileUserId,
            roostName: self.state.roostName
        }).then(function(result){
            console.log("created ready roost, so happy", result);
            ReactGA.set({ userId: self.state.currentUser.objectId });
            ReactGA.event({
                  category: "ReadyRoost",
                  action: "Created ReadyRoost"
                });
            self.props.router.replace("/roosts/" + (result.roost.objectId || result.roost.id));
        },
        function(error){
            console.error("can not create roost, already have one for this user", error);
            self.setState({error: {message: "You have already created a Roost for this user."}})
        })
    },
    handleNameChange(val){
        if( this.state.roostName != null && this.state.roostName.length > 1 && this.state.currentUser)
        {
            this.setState({canSubmit: true})
        }
        else {
            this.setState({canSubmit: false})
        }
    },
    render () {
        if ( this.pendingQueries().length > 0 ){
            return <LoadingTakeover messsage={"Loading Profile"}/>
        }
        if( this.data.profileUser.length < 1 )
        {
            return <FourOhFourPage/>
        }

        var currentUser = this.state.currentUser
        var profileUser = this.data.profileUser[0]

        var loginRow = null
        var readyRoostRow = null;
        var canSubmit = currentUser && this.state.roostName != null && this.state.roostName.length > 1

        var alert = null
        if ( this.state.error ){
            alert = <div className="alert alert-warning" role="alert">{this.state.error.message}</div>
        }

        if ( !currentUser )
        {
            loginRow =
            <div className="">
                <p className="loginHelp">To get started, you'll need to create an account below.</p>
                <LoginComponent
                    success={this.loginSuccess}
                    logoutSuccess={this.logoutSuccess} />
            </div>
        }
        else {
            readyRoostRow =
                <div className="">
                    <h3>Create a Opportunity for {RoostUtil.getFullName(profileUser)}</h3>
                    {alert}
                    <div className="form-group">
                        <label htmlFor="readyRoostName" className="control-label">Opportunity Name</label>
                        <input id="readyRoostName"
                            type="text"
                            className="form-control"
                            value={this.state.roostName}
                            onChange={linkState(this,"roostName")}
                            placeholder={"Opportunity for " + RoostUtil.getFullName(profileUser)}/>
                    </div>
                    <button type="submit" className={"btn btn-primary btn-block" } disabled={!canSubmit} onClick={this.createReadyRoost}>Let's get started!</button>
                </div>
        }

        var page =
        <div className="PublicProfilePage">
            <RoostNav showHome={false}></RoostNav>
            <div className="container col-md-6 col-md-offset-3">
                <div className="">
                    <h1>
                        Welcome to OneRoost!
                    </h1>
                    <p className="lead">
                        You’re here because <span className="profileUser">{RoostUtil.getFullName(profileUser)}</span> would like you to create a Roost to learn more about the business opportunity. With OneRoost, you will be able to present the opportunity in a simple and straightforward manner, accelerating the decision process.
                    </p>
                    <p>
                        Once you create a Roost for the opportunity below, you can add documents, create next steps, and communicate the value of a partnership!
                    </p>

                </div>
                {loginRow}
                {readyRoostRow}
            </div>
        </div>

        return page
    }
}))

export default PublicProfilePage
