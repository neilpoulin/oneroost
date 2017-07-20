import React, {Component} from "react";
import {connect} from "react-redux";
import Clickable from "Clickable"
import {LOG_OUT_ALIAS, LOG_IN_GOOGLE_ALIAS} from "actions/user"
import {getFullName} from "selectors/user"

// import {handleSignInClick, handleSignOutClick} from "background/googleAuth"

class PopupView extends Component {
    render() {
        const {userId, fullName, logOut, isLoggedIn, logInGoogle, googleEmail} = this.props
        return (
            <div className="container-fluid">
                <div display-if={!isLoggedIn}>
                    <div className="googleLogin" onClick={logInGoogle} display-if={!googleEmail}></div>
                    <div display-if={googleEmail}>
                        Logged in as {googleEmail}
                    </div>
                </div>
                <div display-if={isLoggedIn}>
                    <div display-if={fullName}>
                        Welcome, {fullName}
                    </div>
                    <div display-if={userId}>
                        Your User ID is {userId}
                        <div>
                            <Clickable text="Log Out" onClick={logOut}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        userId: state.user.userId,
        fullName: getFullName(state),
        isLoggedIn: state.user.isLoggedIn,
        googleEmail: state.user.googleEmail,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        logOut: () => dispatch({type: LOG_OUT_ALIAS}),
        logInGoogle: () => dispatch({type: LOG_IN_GOOGLE_ALIAS}),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PopupView)
