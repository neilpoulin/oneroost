import React from "react"
import PropTypes from "prop-types"
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
    },
    getDefaultProps(){
        return {
            message: "Nothing here, yet!",
            buttonClass: "btn-outline-primary",
            className: "",
        }
    },
    render () {
        const {message, link, buttonClass, className} = this.props
        return (
            <div className={`EmptyState ${className}`}>
                <div className="lead">{message}</div>
                <div className="lead" display-if={link}>
                    <Link to={link.path} className={`btn ${buttonClass}`}>{link.text}</Link>
                </div>
            </div>
        )
    }
})

export default EmptyState
