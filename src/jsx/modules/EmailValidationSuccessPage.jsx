import React, { PropTypes } from "react"
import RoostNav from "RoostNav"
import {connect} from "react-redux"
import * as Account from "models/Account"
import {refreshCachedUserData, connectToAccount} from "ducks/user"
import {denormalize} from "normalizr"

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
        const {username, addToAccount, account} = this.props;
        return (
            <div className="EmailValidationSuccessPage">
                <RoostNav/>
                <div className="container">
                    <h2>Success!</h2>
                    <p className="lead">
                        Your email ({username}) has been successfully verified.
                    </p>
                    <button display-if={!account} className="btn btn-outline-primary" onClick={() => addToAccount()}>Connect to {account ? account.accountName : "Account"}</button>
                    <p className="lead" display-if={account}>
                        You are now a part of {account.accountName}!
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
    const accountId = user.accountId
    let account = null
    if (accountId){
        account = denormalize(accountId, Account.Schema, state.entities.toJS())
    }
    return {
        username,
        account,
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        refreshUser: () => {
            dispatch(refreshCachedUserData())
            // dispatch(connectToAccount())
        },
        addToAccount: () => {
            dispatch(connectToAccount())
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EmailValidationSuccessPage)
