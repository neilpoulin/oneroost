import React, { PropTypes } from "react"
import Image from "Image"
class ImageError extends React.Component {
    constructor(props) {
        super(props);
    }

    render () {
        const {useErrorImage, backupImageUrl, className} = this.props
        if (!useErrorImage){
            return null
        }
        return <Image display-if={backupImageUrl} src={backupImageUrl} useErrorImage={false} className={className}/>
    }
}

ImageError.propTypes = {
    useErrorImage: PropTypes.bool,
    backupImageUrl: PropTypes.string,
    className: PropTypes.string,
}

ImageError.defaultProps = {
    useErrorImage: false,
    backupImageUrl: "/static/images/image_error.png",
}

export default ImageError;
