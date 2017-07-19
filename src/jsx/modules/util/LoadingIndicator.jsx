import React from "react"
import PropTypes from "prop-types"

const LoadingIndicator = React.createClass({
    propTypes: {
        message: PropTypes.string,
        size: PropTypes.oneOf(["default", "large"])
    },
    getDefaultProps(){
        return{
            message: "",
            size: "default"
        }
    },
    render () {
        let {message, size} = this.props
        if ( message ){
            message = <div className="message">{message}</div>
        }
        return (
            <div className={`LoadingIndicator size-${size}`}>
                <i className="fa fa-spin fa-spinner"></i>
                {message}
            </div>
        )
    }
})

export default LoadingIndicator
