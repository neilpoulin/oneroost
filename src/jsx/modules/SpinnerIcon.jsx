import React, {PropTypes} from "react"

export default React.createClass({
    propTypes: {
        message: PropTypes.string,
        size: PropTypes.string,
    },
    render: function(){
        const {size, message} = this.props
        const sizeClass = size ? `fa-${size}` : ""

        return (
            <span>
                <i className={`fa fa-spinner fa-spin ${sizeClass}`}/>
                <span display-if={message}>{message}</span>
            </span>
        );
    }
});
