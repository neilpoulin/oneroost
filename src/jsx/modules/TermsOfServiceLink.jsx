import React, { PropTypes } from "react"
import {Link} from "react-router"

const TermsOfServiceLink = React.createClass({
    propTypes: {
        text: PropTypes.string
    },
    getDefaultProps() {
        return {
            text: "Terms of Service"
        }
    },
    render () {
        return (
            <Link to="/terms">
                {this.props.text}
            </Link>
        )
    }
})

export default TermsOfServiceLink
