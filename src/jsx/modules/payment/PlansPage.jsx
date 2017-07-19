import React from "react"
import PropTypes from "prop-types"
import {connect} from "react-redux"
import {Link} from "react-router"
import RoostNav from "RoostNav"
import PlansComponent from "PlansComponent"

import Logo from "Logo";

const PlansPage = React.createClass({
    propTypes: {
        currentUser: PropTypes.object,
        showSignUp: PropTypes.bool,
        message: PropTypes.string,
    },
    getDefaultProps(){
        return {
            message: "Choose a plan that's right for you",
            showSignUp: true,
        }
    },
    render () {
        const {currentUser, message, showSignUp} = this.props;
        let signupButton = null
        if ( !currentUser.isLoggedIn && showSignUp){
            signupButton = <Link to={{ pathname: "/signup", query: { forward: "/plans" } }}
                className="btn btn-primary">Sign Up</Link>
        }
        return (
            <div className="PricingPage">
                <RoostNav/>
                <div className="container">
                    <div className="heading">
                        <div>
                            <Logo className="header"/>
                        </div>
                        <p className="lead">
                            {message}
                        </p>
                        <div>
                            {signupButton}
                        </div>
                    </div>
                    <PlansComponent/>
                </div>
            </div>
        )
    }
})

const mapStateToProps = (state, ownProps) => {
    let currentUser = state.user.toJS()
    return {
        currentUser,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {

    }
}


export default connect(mapStateToProps, mapDispatchToProps)(PlansPage);
