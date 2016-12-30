import React, {PropTypes} from "react"
import PublicProfileLink from "profile/PublicProfileLink"

const BetaUserWelcome = React.createClass({
    propTypes: {
        userId: PropTypes.string.isRequired
    },
    render () {
        let {userId} = this.props;
        let welcome =
        <div className="BetaUserWelcome">
            {"Congratulations on joining OneRoost. Get started by sending the link below to your prospective partners."}
            <p className="link-container">
                <PublicProfileLink userId={userId}/>
            </p>

        </div>
        return welcome;
    }
})

export default BetaUserWelcome
