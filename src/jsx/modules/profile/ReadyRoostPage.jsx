import React, { PropTypes } from "react"
import RoostNav from "RoostNav";
import ParseReact from "parse-react"
import Parse from "parse"
import LoadingTakeover from "LoadingTakeover"
import FourOhFourPage from "FourOhFourPage"
import ReactGA from "react-ga"
import { withRouter } from "react-router"
import Onboarding from "readyroost/Onboarding"

const ReadyRoostPage = withRouter( React.createClass({
    mixins: [ParseReact.Mixin],
    propTypes: {
        params: PropTypes.shape({
            userId: PropTypes.string.isRequired
        }).isRequired
    },
    observe(props, state){
        var userId= props.params.userId;
        return {
            readyRoostUser: (new Parse.Query("User")).equalTo( "objectId", userId )
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
        if( this.data.readyRoostUser.length < 1 )
        {
            return <FourOhFourPage/>
        }

        var currentUser = this.state.currentUser;
        var readyRoostUser = this.data.readyRoostUser[0];

        var page =
        <div className="ReadyRoostPage">
            <RoostNav showHome={false}></RoostNav>
            <div className="container col-md-4 col-md-offset-4">
                <Onboarding readyRoostUser={readyRoostUser} currentUser={currentUser} />
            </div>
        </div>

        return page
    }
}))

export default ReadyRoostPage
