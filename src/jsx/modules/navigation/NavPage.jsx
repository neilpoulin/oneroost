import React from "react"
import PropTypes from "prop-types"
import RoostNav from "RoostNav"
const NavPage = React.createClass({
    propTypes: {
        showHome: PropTypes.bool
    },
    getDefaultProps(){
        return {
            showHome: true
        }
    },
    render () {
        return <div>
            <RoostNav showHome={this.props.showHome}/>
            {this.props.children}
        </div>
    }
})

export default NavPage
