import React, { PropTypes } from "react"
import {connect} from "react-redux"
import RoostNav from "RoostNav"
import {resendEmailVerification} from "ducks/user"

const EmailValidationSuccessPage = React.createClass({
    propTypes: {
        emailVerified: PropTypes.bool.isRequired,
        userId: PropTypes.string,
        accountId: PropTypes.string,
        firstName: PropTypes.string,
        resendEmail: PropTypes.func.isRequired,
    },
    render () {
        const {firstName, resendEmail, sendSuccessMessage} = this.props
        return (
            <div className="EmailValidationSuccessPage">
                <RoostNav/>
                <div className="container">
                    <h2>Success!</h2>
                    <p className="lead">
                        <span display-if={firstName}>{firstName}, </span>Please check your email and click the link to validate you address.
                    </p>
                    <div>
                        <button className="btn btn-secondary-outline" onClick={resendEmail}>Resend Verification Email</button>
                        <p display-if={sendSuccessMessage}>{sendSuccessMessage}</p>
                    </div>
                </div>
            </div>
        )
    }
})

const mapStateToProps = (state, ownProps) => {
    const user = state.user.toJS()
    let {emailVerified, userId, accountId, firstName, lastEmailValidationSent, email} = user
    let sendSuccessMessage = lastEmailValidationSent ? `An email has been sent to ${email}` : null
    return {
        emailVerified,
        userId,
        accountId,
        firstName,
        sendSuccessMessage,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        resendEmail: () => {
            dispatch(resendEmailVerification())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EmailValidationSuccessPage)
