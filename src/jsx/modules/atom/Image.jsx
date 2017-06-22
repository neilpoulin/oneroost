import React from "react"
import PropTypes from "prop-types"
import * as log from "LoggingUtil"
import ImageError from "ImageError"

class Image extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            errored: false,
        };
    }
    _onError = () => {
        log.warn(`Failed to get image: ${this.props.src}`)
        this.setState({errored: true})
        this.props.onError();
    }
    render () {
        const {src, useErrorImage, backupImageUrl, className} = this.props
        const {errored} = this.state
        if (errored){
            return <ImageError useErrorImage={useErrorImage} backupImageUrl={backupImageUrl} className={className}/>
        }
        return <img src={src} onError={() => this._onError()} className={className}/>
    }
}

Image.propTypes = {
    src: PropTypes.string.isRequired,
    onError: PropTypes.func,
    useErrorImage: PropTypes.bool,
    backupImageUrl: PropTypes.string,
    className: PropTypes.string,
}

Image.defaultProps = {
    onError: () => {},
    useErrorImage: false,
}

export default Image;
