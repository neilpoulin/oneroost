import React from "react"
import PropTypes from "prop-types"
import * as log from "LoggingUtil"

class Image extends React.Component {
    render () {
        const {src, onError} = this.props
        return <img src={src} onError={onError}/>
    }
}

Image.propTypes = {
    src: PropTypes.string.isRequired,
    onError: PropTypes.func,
}

Image.defaultProps = {
    onError: () => {
        log.warn("Failed to load image for src = " + this.props.src)
    }
}

export default Image;
