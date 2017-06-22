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
        const {text} = this.props
        return (
            <button className="btn btn-outline-primary"
                onClick={this._handleClick}
                >{text}</button>
        )
    }
}

Clickable.propTypes = {
    text: PropTypes.string,
    onClick: PropTypes.func
}

export default Clickable
