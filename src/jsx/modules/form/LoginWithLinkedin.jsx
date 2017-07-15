import React from "react"
import LinkedIn from "react-linkedin-login"
import {connect} from "react-redux"
import {
    loginWithLinkedin
} from "ducks/user"

const clientId = OneRoost.Config.linkedinClientId

class LoginWithLinkedin extends React.Component {
    render() {
        return (
            <LinkedIn
                clientId={clientId}
                callback={this.props.linkedInSuccess}
                className={"linkedinLogin"}
                text={undefined}
                ></LinkedIn>
        );
    }
}

const mapDispatchToProps = (dispatch, getState) => {
    return {
        linkedInSuccess: ({code, redirectUri}) => {
            dispatch(loginWithLinkedin({
                code,
                redirectUri
            }))
        }
    }
}

export default connect(undefined, mapDispatchToProps)(LoginWithLinkedin);
