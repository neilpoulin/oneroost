import React, {Component} from "react";
import {connect} from "react-redux";
import Clickable from "Clickable"
import {LOG_OUT_ALIAS, LOG_IN_GOOGLE_ALIAS} from "actions/user"
import {getFullName} from "selectors/user"

// import {handleSignInClick, handleSignOutClick} from "background/googleAuth"

class PopupView extends Component {
    render() {
        const {userId, fullName, logOut, isLoggedIn, logInGoogle, email, pages, brandPagesLoading} = this.props
        return (
            <div className="container-fluid PopupView">
                <div display-if={!isLoggedIn} className="loginContainer">
                    <div className="googleLogin" onClick={logInGoogle}></div>
                </div>
                <div display-if={isLoggedIn} className="">
                    <div className="header">
                        <div display-if={fullName} className="email">
                            {email}
                        </div>
                        <Clickable text="Log Out"
                            onClick={logOut}
                            className="logout"
                            look="link"/>
                    </div>

                    <div display-if={userId} className="content">
                        <div>
                            <Clickable href={"https://www.oneroost.com/settings/templates"}
                                target="_blank"
                                look="button"
                                text="Manage Tempaltes"/>
                        </div>
                        <div display-if={!brandPagesLoading && pages} className="brandPages">
                            <h3>Brand Pages</h3>
                            <ul className="list-unstyled">
                                {pages.map((page, i) =>
                                    <li><Clickable target="_blank" look="link" key={`page_${i}`} text={page.vanityUrl} href={`https://www.oneroost.com/${page.vanityUrl}`}/></li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    const user = state.user
    const {email, isLoggedIn, userId} = user
    const brandPages = state.brandPages

    return {
        userId,
        fullName: getFullName(state),
        isLoggedIn,
        email,
        brandPagesLoading: brandPages.isLoading,
        pages: brandPages.pages,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        logOut: () => dispatch({type: LOG_OUT_ALIAS}),
        logInGoogle: () => dispatch({type: LOG_IN_GOOGLE_ALIAS}),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PopupView)
