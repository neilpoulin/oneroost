import React, { PropTypes } from "react"
import RoostNav from "RoostNav";
import Parse from "parse"
import LoadingTakeover from "LoadingTakeover"
import FourOhFourPage from "FourOhFourPage"
import ReactGA from "react-ga"
import { withRouter } from "react-router"
import Onboarding from "readyroost/Onboarding"

const ReadyRoostPage = withRouter( React.createClass({
    propTypes: {
        params: PropTypes.shape({
            userId: PropTypes.string.isRequired
        }).isRequired
    },
    fetchData(userId){
        let self = this;
        let userQuery = new Parse.Query("User");
        userQuery.get(userId).then(user => {
            self.setState({
                readyRoostUser: user,
                loading: false
            })
        }).catch(error => {
            console.log("errror getting user", error);
            self.setState({
                readyRoostUser: null,
                loading: false
            })
        });
    },
    componentWillMount(){
        this.fetchData(this.props.params.userId);
    },
    componentWillUpdate(nextProps, nextState){
        if ( this.props.params.userId !== nextProps.params.userId ){
            let userId = nextProps.params.userId;
            this.fetchData(userId);
        }
    },
    getInitialState(){
        return {
            currentUser: Parse.User.current(),
            roostName: null,
            canSubmit: false,
            error: null,
            readyRoostUser: null,
            loading: true
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
            let createdRoost = result.toJSON()
            console.log("created ready roost, so happy", result);
            ReactGA.set({ userId: self.state.currentUser.objectId });
            ReactGA.event({
                  category: "ReadyRoost",
                  action: "Created ReadyRoost"
                });
            self.props.router.replace("/roosts/" + createdRoost.objectId);
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
        if ( this.state.loading ){
            return <LoadingTakeover messsage={"Loading Profile"}/>
        }
        if( !this.state.readyRoostUser )
        {
            return <FourOhFourPage/>
        }

        var currentUser = this.state.currentUser;
        var readyRoostUser = this.state.readyRoostUser;

        var page =
        <div className="ReadyRoostPage">
            <RoostNav showHome={false}></RoostNav>
            <div className="container col-md-6 col-md-offset-3 col-lg-4 col-lg-offset-4">
                <Onboarding readyRoostUser={readyRoostUser} currentUser={currentUser} />
            </div>
        </div>

        return page
    }
}))

export default ReadyRoostPage
