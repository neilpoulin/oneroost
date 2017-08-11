import React from "react"
import PropTypes from "prop-types"
import Logo from "Logo"
import {Link} from "react-router"
const EmptyState = React.createClass({
    propTypes: {
        message: PropTypes.string,
        link: PropTypes.shape({
            path: PropTypes.string.isRequired,
            text: PropTypes.string.isRequired
        }),
        className: PropTypes.string,
        buttonClass: PropTypes.string,
        showLogo: PropTypes.bool,
    },
    getDefaultProps(){
        return {
            message: "Nothing here, yet!",
            buttonClass: "btn-outline-primary",
            className: "",
            showLogo: false,
        }
    },
    render () {
        const {message, link, buttonClass, className, showLogo} = this.props
        return (
            <div className={`EmptyState ${className}`}>
                <Logo display-if={showLogo} className="header"/>
                <div className="lead">{message}</div>
                <div className="lead" display-if={link}>
                    <Link to={link.path} className={`btn ${buttonClass}`}>{link.text}</Link>
                </div>
            </div>
        )
    }
})

export default EmptyState
