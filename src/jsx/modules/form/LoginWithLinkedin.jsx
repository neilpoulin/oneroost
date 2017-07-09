import React, { PropTypes } from "react"
import LinkedIn from "react-linkedin-login"

const clientId = "78v10otstxnu8h"

class LoginWithLinkedin extends React.Component {
    static propTypes = {
        connectSuccess: PropTypes.func.isRequired,
    }

    _callbackLinkedIn = (response) => {
        console.log("Logged in", response)
        const {code, redirectUri} = response
        this.props.connectSuccess({
            access_token: code,
        })
    }

    render () {
        return (
            <LinkedIn
                clientId={clientId}
                callback={this._callbackLinkedIn}
                className={"linkedinLogin"}
                text='LinkedIn' />
        )
    }
}

export default LoginWithLinkedin;
