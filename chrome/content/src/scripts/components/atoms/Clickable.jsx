import React, {Component} from "react";
import PropTypes from "prop-types";

class Clickable extends Component{
    constructor(props){
        super(props)
    }
    _handleClick= (e) => {
        if (this.props.onClick){
            this.props.onClick(e)
        }
    }

    render () {
        const {text, className} = this.props
        return (
            <button className={`btn ${className}`}
                onClick={this._handleClick}
                >{text}</button>
        )
    }
}

Clickable.defaultProps = {
    className: "btn-outline-primary"
}

Clickable.propTypes = {
    text: PropTypes.string,
    onClick: PropTypes.func,
    className: PropTypes.string,
}

export default Clickable
