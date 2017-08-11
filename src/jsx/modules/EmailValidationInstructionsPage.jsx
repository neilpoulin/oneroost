import React from "react"
import PropTypes from "prop-types"
import {connect} from "react-redux"
import RoostNav from "RoostNav"
import {resendEmailVerification} from "ducks/user"
import GoogleLoginButton from "GoogleLoginButton"
import {push} from "react-router-redux"
import {Link} from "react-router"
import Logo from "Logo"

class EmailValidationSuccessPage extends React.Component{
    static propTypes = {
        emailVerified: PropTypes.bool.isRequired,
        userId: PropTypes.string,
        accountId: PropTypes.string,
        firstName: PropTypes.string,
        resendEmail: PropTypes.func.isRequired,
    }

    componentDidMount(){
        const {emailVerified, navigateToSuccess} = this.props;
        if (emailVerified){
            navigateToSuccess()
        }
    }

    render () {
        const {firstName, resendEmail, sendSuccessMessage, hostedDomain} = this.props
        return (
            <div className="EmailValidationSuccessPage">
                <RoostNav/>
                <Logo className="header"/>
                <div className="container">
                    <section>
                        <p className="lead">
                            <span display-if={firstName}>{firstName}, </span>Please check your email and click the link to validate you address.
                        </p>
                        <Link className="" onClick={resendEmail}>Resend Verification Email</Link>
                        <p display-if={sendSuccessMessage}>{sendSuccessMessage}</p>
                    </section>
                    <section>
                        <p className="">Or Connect with Google</p>
                        <GoogleLoginButton hostedDomain={hostedDomain}/>
                    </section>

                </div>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    const user = state.user.toJS()
    let {emailVerified, userId, accountId, firstName, lastEmailValidationSent, email} = user
    let sendSuccessMessage = lastEmailValidationSent ? `An email has been sent to ${email}` : null
    let hostedDomain = email.split("@")[1]
    return {
        emailVerified,
        userId,
        accountId,
        firstName,
        sendSuccessMessage,
        hostedDomain,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        resendEmail: () => {
            dispatch(resendEmailVerification())
        },
        navigateToSuccess: () => {
            dispatch(push("/verify-email-success"))
        }

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EmailValidationSuccessPage)
