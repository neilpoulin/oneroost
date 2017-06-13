import React, { PropTypes } from "react"
import RoostNav from "RoostNav"
import {connect} from "react-redux"
import * as Account from "models/Account"
import {refreshCachedUserData, connectToAccount} from "ducks/user"
import {Link} from "react-router"
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
                        Your email <span display-if={username}>({username})</span> has been successfully verified.
                    </p>
                    <div display-if={!account} >
                        <p className="lead">
                            Now, you just need to create or join an account
                        </p>
                        <button className="btn btn-outline-primary" onClick={() => addToAccount()}>
                             {account ? `Connect to ${account.accountName}` : "Create a new Account"}
                        </button>
                    </div>
                    <div display-if={account}>
                        <p className="lead">
                            You are now a part of {account.accountName}!
                        </p>
                        <div>
                             <Link to="/roosts" className="btn btn-primary">Continue to my opportunities</Link>
                        </div>
                    </div>

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
