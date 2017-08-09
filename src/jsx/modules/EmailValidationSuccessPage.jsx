import React from "react"
import PropTypes from "prop-types"
import RoostNav from "RoostNav"
import {connect} from "react-redux"
import * as Account from "models/Account"
import {refreshCachedUserData, connectToAccount, createAccount} from "ducks/user"
import {Link} from "react-router"
import {denormalize} from "normalizr"
import FormInput from "FormInputGroup"
import {hasPublicDomain} from "util/publicEmailDomains"

class EmailValidationSuccessPage extends React.Component{
    static propTypes = {
        username: PropTypes.string,
        createNewAccount: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props);
        this.state = {
            companyName: ""
        };
    }

    componentDidMount(){
        this.props.refreshUser();
        this.props.addToAccount();
    }

    render () {
        const {username, createNewAccount, account, isPublicDomain, showCreateAccount} = this.props;
        const {companyName} = this.state;
        return (
            <div className="EmailValidationSuccessPage">
                <RoostNav/>
                <div className="container">
                    <h2>Success!</h2>
                    <p className="lead">
                        Your email <span display-if={username}>({username})</span> has been successfully verified.
                    </p>
                    <div display-if={showCreateAccount} >
                        <p className="lead">
                            Now, you just need to finish setting up your orginization
                        </p>
                        <div>
                            <FormInput
                                name="accountName"
                                value={companyName}
                                placeholder="Company Name"
                                label="Company Name"
                                fieldName="accountName"
                                onChange={(value) => this.setState({companyName: value})}
                                errors={{}}
                                />
                            <div display-if={isPublicDomain}>
                                Note: Because you created an account using a public email domain, you will not be able to have other users join your originazation. If this was in error, please create a new account using your company email address.
                            </div>
                        </div>
                        <button className="btn btn-outline-primary" onClick={() => createNewAccount({companyName})}>
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
}

const mapStateToProps = (state, ownProps) => {
    const user = state.user.toJS()
    const {location} = ownProps;
    let username = null;
    if (location && location.query){
        username = location.query.username
    }
    const isPublicDomain = hasPublicDomain(user.email)
    const {accountId, showCreateAccount} = user
    let account = null
    if (accountId){
        account = denormalize(accountId, Account.Schema, state.entities.toJS())
    }
    return {
        username,
        account,
        isPublicDomain,
        showCreateAccount
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        refreshUser: () => {
            dispatch(refreshCachedUserData())
            // dispatch(connectToAccount())
        },
        addToAccount: () => {
            console.log("adding to existing account.....")
            dispatch(connectToAccount())
        },
        createNewAccount: ({companyName}) => {
            console.log("adding to account.....")
            dispatch(createAccount({companyName}))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EmailValidationSuccessPage)
