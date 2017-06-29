import React, {Component} from "react";
import {connect} from "react-redux";
import Clickable from "Clickable"
import Login from "Login"
import {getFullName, LOG_OUT_ALIAS} from "ducks/user"
import {handleSignInClick, handleSignOutClick} from "background/googleAuth"

class PopupView extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {userId, fullName, logOut, isLoggedIn} = this.props
        return (
            <div className="container-fluid">
                <div>
                    <button className="btn btn-success" onClick={handleSignInClick}>Sign In</button>
                    <button className="btn btn-error" onClick={handleSignOutClick}>Sign Out</button>
                </div>

                <div display-if={fullName}>
                    Welcome, {fullName}
                </div>
                <div display-if={userId}>
                    Your User ID is {userId}
                    <div>
                        <Clickable text="Log Out" onClick={logOut}/>
                    </div>
                </div>
                <div display-if={!isLoggedIn}>
                    <Login/>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        userId: state.user.userId,
        fullName: getFullName(state),
        isLoggedIn: state.user.isLoggedIn
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        logOut: () => dispatch({type: LOG_OUT_ALIAS})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PopupView)
