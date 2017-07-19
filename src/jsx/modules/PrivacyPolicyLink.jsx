import React from "react"
import PropTypes from "prop-types"
import {Link} from "react-router"

const PrivacyPolicyLink = React.createClass({
    propTypes: {
        text: PropTypes.string
    },
    getDefaultProps() {
        return {
            text: "Privacy Policy"
        }
    },
    render () {
        return (
            <Link to="/privacy">
                {this.props.text}
            </Link>
        )
    }
})

export default PrivacyPolicyLink
