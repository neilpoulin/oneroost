import React from "react"
import TermsOfServiceLink from "TermsOfServiceLink"

const TermsOfServiceDisclaimer = React.createClass({
    render () {
        return (
            <div className="TermsOfServiceDisclaimer">
                By creating an account or logging in, you agree to our <TermsOfServiceLink/>.
            </div>);
    }
})

export default TermsOfServiceDisclaimer
