import React from "react"
import PropTypes from "prop-types"
import {connect} from "react-redux"

import FreeWidget from "FreeWidget"
import MonthlyWidget from "MonthlyWidget"
import YearlyWidget from "YearlyWidget"

const PlansComponent = React.createClass({
    propTypes: {
        currentUser: PropTypes.object,
        showSignUp: PropTypes.bool,
    },
    render () {
        return (
            <div className="PlansComponent">
                <div className="plans">
                    <FreeWidget/>
                    <MonthlyWidget/>
                    <YearlyWidget/>
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


export default connect(mapStateToProps, mapDispatchToProps)(PlansComponent);
