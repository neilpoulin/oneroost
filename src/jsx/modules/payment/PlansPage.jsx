import React, { PropTypes } from "react"
import {connect} from "react-redux"
import {Link} from "react-router"
import RoostNav from "RoostNav"
import FreeWidget from "FreeWidget"
import MonthlyWidget from "MonthlyWidget"
import YearlyWidget from "YearlyWidget"

import Logo from "Logo";

const PlansPage = React.createClass({
    propTypes: {
        currentUser: PropTypes.object,
        showSignUp: PropTypes.bool,
    },
    render () {
        const {currentUser} = this.props;
        const showSignUp = currentUser.isLoggedIn
        let signupButton = null
        if ( !currentUser.isLoggedIn){
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
                            {"Choose a plan that's right for you"}
                        </p>
                        <div>
                            {signupButton}
                        </div>
                    </div>
                    <div className="plans">
                        <FreeWidget/>
                        <MonthlyWidget/>
                        <YearlyWidget/>
                    </div>
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
