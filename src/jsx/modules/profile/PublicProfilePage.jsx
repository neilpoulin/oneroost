import React, { PropTypes } from "react"
import RoostNav from "./../navigation/RoostNav";
import ParseReact from "parse-react"
import Parse from "parse"
import LoadingTakeover from "./../util/LoadingTakeover"
import RoostUtil from "./../util/RoostUtil"
import FourOhFourPage from "./../FourOhFourPage"
import LoginComponent from "./../LoginComponent"

const PublicProfilePage = React.createClass({
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
            currentUser: Parse.User.current()
        }
    },
    loginSuccess(){
        console.log("login success")
        this.setState({currentUser: Parse.User.current()})
    },
    logoutSuccess(){
        console.log("logout success")
        this.setState({currentUser: null})
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

        var loginComponent = null
        if ( !currentUser )
        {
            loginComponent = <LoginComponent
                success={this.loginSuccess}
                logoutSuccess={this.logoutSuccess}
                ></LoginComponent>
        }

        var page =
        <div className="PublicProfilePage">
            <RoostNav showHome={false}></RoostNav>
            <div className="container">
                <div>
                    <h1>
                        Welcome to OneRoost!
                    </h1>
                    <p>
                        You’re here because <span className="profileUser">{RoostUtil.getFullName(profileUser)}</span> would like you to create a Roost to learn more about the business opportunity. With OneRoost, you will be able to present the opportunity in a simple and straightforward manner, accelerating the decision process.
                    </p>
                    <p>
                        Once you create a Roost for the opportunity below, you can add documents, create next steps, and communicate the value of a partnership!
                    </p>

                </div>
                {loginComponent}

            </div>

        </div>

        return page
    }
})

export default PublicProfilePage
