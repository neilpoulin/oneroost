import React, { PropTypes } from "react"
import {withRouter} from "react-router"
import RoostNav from "RoostNav"
import {connect} from "react-redux"
import {refreshCachedUserData, connectToAccount} from "ducks/user"

const EmailValidationSuccessPage = React.createClass({
    propTypes: {
        username: PropTypes.string
    },
    componentDidMount(){
        this.props.refreshUser();
    },
    getDefaultProps(){

    },
    render () {
        const {username} = this.props;
        return (
            <div className="EmailValidationSuccessPage">
                <RoostNav/>
                <div className="container">
                    <h2>Success!</h2>
                    <p className="lead">
                        Your email ({username}) has been successfully verified.
                    </p>
                </div>
            </div>
        )
    }
})

const mapStateToProps = (state, ownProps) => {
    const user = state.user.toJS()
    const {location} = ownProps;
    let username = null;
    if (location && location.query){
        username = location.query.username
    }

    return {
        username,
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        refreshUser: () => {
            dispatch(refreshCachedUserData())
            dispatch(connectToAccount())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EmailValidationSuccessPage)
