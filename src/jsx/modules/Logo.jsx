import React, { PropTypes } from "react"

const Logo = React.createClass({
    propTypes: {
        className: PropTypes.string
    },
    getDefaultProps(){
        return {
            className: ""
        }
    },
    render () {
        let logo =
        <div className={`logo cursive ${this.props.className}`}>
            OneRoost
        </div>
        return logo;
    }
})

export default Logo
